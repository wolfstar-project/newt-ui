import path from "node:path"

import { getRegistryItem } from "../../registry/api.js"
import type { RegistryItem } from "../../schema/index.js"
import {
  findFirstExisting,
  readFileIfExists,
  relativePath,
  writeFileAt,
} from "../fileSystem.js"
import type { Config } from "../get-config.js"
import { highlighter, logger } from "../logger.js"
import { TAILWIND_CONFIG_CANDIDATES } from "../options.js"
import { detectTailwindMajor } from "../tailwind.js"
import {
  appendThemeNames,
  missingThemeNames,
  renderThemeNames,
  themeCatalogue,
  themeNameList,
  themeNamesUsed,
  type ProjectTheme,
  type ThemeCatalogue,
  type ThemeNames,
} from "../theme-names.js"

/** The registry item that carries the design tokens. */
export const THEME_ITEM = "theme-newt"

/** How deep `@import` chains are followed; a real project needs two or three. */
const MAX_IMPORT_DEPTH = 8

/** The relative `@import` targets of a stylesheet: `./newt.css`, `../x.css`. */
function relativeImports(css: string): string[] {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "")
  return [
    ...clean.matchAll(
      /@import\s+(?:url\(\s*)?["']?(\.{1,2}\/[^"')\s;]+)["']?\s*\)?/g
    ),
  ].flatMap((match) => (match[1] === undefined ? [] : [match[1]]))
}

/**
 * The text of a stylesheet and of every stylesheet it imports by a relative
 * path, joined. A project that keeps its tokens in `newt.css` and imports it
 * from `main.css` declares them as surely as one that writes them inline.
 * Package imports (`@import "tailwindcss"`) are not followed.
 */
export async function readStylesheets(entry: string): Promise<string> {
  const seen = new Set<string>()
  async function read(file: string, depth: number): Promise<string[]> {
    const resolved = path.resolve(file)
    if (seen.has(resolved) || depth > MAX_IMPORT_DEPTH) return []
    seen.add(resolved)
    const css = await readFileIfExists(resolved)
    if (css === null) return []
    const imported = await Promise.all(
      relativeImports(css).map((target) =>
        read(path.resolve(path.dirname(resolved), target), depth + 1)
      )
    )
    return [css, ...imported.flat()]
  }
  return (await read(entry, 0)).join("\n")
}

/** The stylesheet text, the Tailwind major and, on v3, the config source. */
export async function readProjectTheme(config: Config): Promise<ProjectTheme> {
  const { cwd, tailwindCss, tailwindConfig } = config.resolvedPaths
  const major = await detectTailwindMajor(cwd, tailwindCss)
  const configFile =
    major === 3
      ? ((await readFileIfExists(tailwindConfig)) ??
        (await readConfigCandidate(cwd)))
      : null
  return { major, css: await readStylesheets(tailwindCss), config: configFile }
}

async function readConfigCandidate(cwd: string): Promise<string | null> {
  const found = findFirstExisting(cwd, TAILWIND_CONFIG_CANDIDATES)
  return found === undefined ? null : readFileIfExists(found)
}

/**
 * The theme item, read into a catalogue. `undefined` when the registry does
 * not serve it, which a custom registry may not: the caller says the check
 * was skipped instead of failing the command it is part of.
 */
export async function fetchThemeCatalogue(
  registryUrl: string,
  style: string
): Promise<ThemeCatalogue | undefined> {
  try {
    return themeCatalogue(await getRegistryItem(registryUrl, style, THEME_ITEM))
  } catch (error) {
    const detail = error instanceof Error ? ` ${error.message}` : ""
    logger.info(
      `Could not fetch ${THEME_ITEM}, so newtui did not check your stylesheet for theme names.${detail}`
    )
    return undefined
  }
}

/**
 * Print the missing names and the block that adds them. Nothing is written:
 * `newtui tokens` writes the same block.
 */
export function reportMissingThemeNames(
  missing: ThemeNames,
  catalogue: ThemeCatalogue,
  project: ProjectTheme,
  config: Config
): void {
  const names = themeNameList(missing)
  if (names.length === 0) return
  const { cwd, tailwindCss, tailwindConfig } = config.resolvedPaths
  const stylesheet = relativePath(cwd, tailwindCss)
  const rendered = renderThemeNames(
    missing,
    catalogue,
    project.major,
    config.tailwind.darkSelector
  )

  logger.warn(
    `Your project does not declare ${names.length} theme name(s) these components use: ${names.join(", ")}. The classes that read them produce no CSS.`
  )
  logger.log(
    `Run ${highlighter.info("npx newtui tokens")} to add them, or paste this into ${highlighter.info(stylesheet)}:`
  )
  logger.log(highlighter.dim(rendered.css.trimEnd()))
  if (rendered.config !== undefined) {
    logger.log(
      `Then add these entries to ${highlighter.info("theme.extend")} in ${highlighter.info(relativePath(cwd, tailwindConfig))}:`
    )
    logger.log(highlighter.dim(rendered.config))
  }
}

/** What `writeMissingThemeNames` did, and what is left to do by hand. */
export interface ThemeNamesWrite {
  /** Whether the stylesheet changed. */
  readonly written: boolean
  /** The v3 config entries to add by hand, since a JS config is not edited. */
  readonly config: string | undefined
}

/** Append the missing names to the stylesheet. */
export async function writeMissingThemeNames(
  missing: ThemeNames,
  catalogue: ThemeCatalogue,
  project: ProjectTheme,
  config: Config
): Promise<ThemeNamesWrite> {
  const cssPath = config.resolvedPaths.tailwindCss
  const rendered = renderThemeNames(
    missing,
    catalogue,
    project.major,
    config.tailwind.darkSelector
  )
  if (rendered.css.length === 0)
    return { written: false, config: rendered.config }
  const existing = (await readFileIfExists(cssPath)) ?? ""
  await writeFileAt(cssPath, appendThemeNames(existing, rendered.css))
  return { written: true, config: rendered.config }
}

/** The text of every file and stylesheet rule a set of items carries. */
export function itemSources(items: readonly RegistryItem[]): string[] {
  return items.flatMap((item) => [
    ...(item.files ?? []).flatMap((file) =>
      file instanceof Object && file.content !== undefined ? [file.content] : []
    ),
    ...(item.css === undefined ? [] : [JSON.stringify(item.css)]),
  ])
}

/**
 * Warn about the theme names `items` use that the project does not declare.
 * `add` and `diff` call it after their own work; it never writes.
 */
export async function checkThemeNames(
  items: readonly RegistryItem[],
  config: Config,
  registryUrl: string
): Promise<void> {
  const catalogue = await fetchThemeCatalogue(registryUrl, config.style)
  if (catalogue === undefined) return
  const project = await readProjectTheme(config)
  const missing = missingThemeNames(
    themeNamesUsed(catalogue, itemSources(items)),
    project
  )
  reportMissingThemeNames(missing, catalogue, project, config)
}
