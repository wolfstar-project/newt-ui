import { readdir } from "node:fs/promises"
import path from "node:path"

import { z } from "zod"

import type { RegistryItem } from "../schema/index.js"
import { findFirstExisting, readFileIfExists } from "./fileSystem.js"
import { TAILWIND_CONFIG_CANDIDATES } from "./options.js"

export const TAILWIND_MAJORS = [3, 4] as const
export type TailwindMajor = (typeof TAILWIND_MAJORS)[number]

/**
 * Which Tailwind major the target project is on.
 *
 * The declared dependency wins, because it is the only unambiguous signal.
 * Otherwise the stylesheet decides: v4 is CSS-first (`@import "tailwindcss"`)
 * while v3 uses the `@tailwind` directives and a JS config. A project with a
 * `tailwind.config.*` and nothing else is treated as v3.
 */
export async function detectTailwindMajor(
  cwd: string,
  cssPath: string
): Promise<TailwindMajor> {
  const pkg = await readFileIfExists(path.join(cwd, "package.json"))
  if (pkg) {
    const range = readTailwindRange(pkg)
    const major = range ? majorFromRange(range) : undefined
    if (major) return major
  }

  const css = await readFileIfExists(cssPath)
  if (css) {
    if (/@import\s+["']tailwindcss["']/.test(css)) return 4
    if (/@tailwind\s+(base|components|utilities)/.test(css)) return 3
  }

  return findFirstExisting(cwd, TAILWIND_CONFIG_CANDIDATES) ? 3 : 4
}

/**
 * The `dependencies`/`devDependencies` maps we need out of `package.json`.
 * Each key is left unvalidated (`unknown`) since we only ever look up a
 * single known key (`tailwindcss`) afterwards; a malformed neighbouring
 * dependency entry should not stop that lookup from succeeding.
 */
const packageJsonSchema = z.object({
  dependencies: z.record(z.string(), z.unknown()).optional(),
  devDependencies: z.record(z.string(), z.unknown()).optional(),
})

function readTailwindRange(packageJson: string): string | undefined {
  let raw: unknown
  try {
    raw = JSON.parse(packageJson)
  } catch {
    return undefined
  }
  const parsed = packageJsonSchema.safeParse(raw)
  if (!parsed.success) return undefined
  for (const field of ["dependencies", "devDependencies"] as const) {
    const range = z.string().safeParse(parsed.data[field]?.tailwindcss)
    if (range.success) return range.data
  }
  return undefined
}

function majorFromRange(range: string): TailwindMajor | undefined {
  const match = /(\d+)/.exec(range)
  if (!match?.[1]) return undefined
  const major = Number.parseInt(match[1], 10)
  return TAILWIND_MAJORS.find((candidate) => candidate === major)
}

/** A stylesheet that already loads Tailwind, in either major. */
const TAILWIND_ENTRY_PATTERN =
  /@import\s+["']tailwindcss["']|@tailwind\s+(?:base|components|utilities)/

/* build output and dependencies: never where an app's own stylesheet lives */
const SKIPPED_DIRECTORIES = new Set([
  "node_modules",
  ".git",
  ".nuxt",
  ".output",
  ".next",
  ".svelte-kit",
  ".turbo",
  "dist",
  "build",
  "coverage",
  "public",
])

const MAX_SCAN_DEPTH = 5

/**
 * The project stylesheet, other than `exclude`, that already loads Tailwind.
 *
 * `init` writes the tokens into one file. When that file is new but the app
 * already has a Tailwind entry elsewhere (`main.css` importing a separate
 * `newt.css`), adding `@import "tailwindcss"` would load Tailwind twice, so
 * `init` leaves the preamble out and tells the user to import the token file
 * from this entry instead.
 */
export async function findTailwindEntry(
  cwd: string,
  exclude: string
): Promise<string | undefined> {
  const excluded = path.resolve(exclude)
  const queue: Array<{ dir: string; depth: number }> = [{ dir: cwd, depth: 0 }]
  while (queue.length > 0) {
    const next = queue.shift()
    if (!next) break
    let entries
    try {
      entries = await readdir(next.dir, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      const target = path.join(next.dir, entry.name)
      if (entry.isDirectory()) {
        if (
          next.depth < MAX_SCAN_DEPTH &&
          !SKIPPED_DIRECTORIES.has(entry.name)
        ) {
          queue.push({ dir: target, depth: next.depth + 1 })
        }
        continue
      }
      if (!entry.isFile() || !entry.name.endsWith(".css")) continue
      if (path.resolve(target) === excluded) continue
      const css = await readFileIfExists(target)
      if (css && TAILWIND_ENTRY_PATTERN.test(css)) return target
    }
  }
  return undefined
}

/** Whether a stylesheet already loads Tailwind itself. */
export function loadsTailwind(css: string): boolean {
  return TAILWIND_ENTRY_PATTERN.test(css)
}

/**
 * The stylesheet preamble a fresh project needs, per major.
 */
export function tailwindPreamble(major: TailwindMajor): string {
  return major === 4
    ? '@import "tailwindcss";\n'
    : "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n"
}

/**
 * Where the dark token values go. `class` and `data-theme` are the two toggles
 * apps actually use; `media` follows the system preference; anything else is
 * taken as a literal selector, so an app with its own convention
 * (`.theme-dark`, `[data-mode="night"]`) is not forced to rename it.
 */
export const DARK_SELECTOR_PRESETS = {
  class: ".dark",
  "data-theme": '[data-theme="dark"]',
  media: "@media (prefers-color-scheme: dark)",
} as const
export type DarkSelectorPreset = keyof typeof DARK_SELECTOR_PRESETS
export const DEFAULT_DARK_SELECTOR: DarkSelectorPreset = "class"

function isDarkSelectorPreset(value: string): value is DarkSelectorPreset {
  return Object.hasOwn(DARK_SELECTOR_PRESETS, value)
}

/** The selector (or `@media` query) a preset name or a literal resolves to. */
export function resolveDarkSelector(value: string | undefined): string {
  const chosen = value?.trim() || DEFAULT_DARK_SELECTOR
  return isDarkSelectorPreset(chosen) ? DARK_SELECTOR_PRESETS[chosen] : chosen
}

/**
 * The Tailwind v3 `darkMode` setting that makes `dark:` utilities follow the
 * same selector the tokens use.
 */
export function tailwindV3DarkMode(value: string | undefined): string {
  const selector = resolveDarkSelector(value)
  if (selector.startsWith("@media")) return '"media"'
  if (selector === ".dark") return '["class"]'
  return JSON.stringify(["selector", selector])
}

/**
 * Render an item's `cssVars` and `css` into a stylesheet block.
 *
 * On v4 the theme entries become an `@theme` block, which is what generates
 * the `bg-newt-*` / `shadow-elevation-*` utilities — there is no JS config to
 * extend. On v3 those same utilities come from the preset in
 * `tailwind.config`, so only the raw custom properties are written here.
 *
 * Light is the default surface: `:root` gets one complete set (every dark
 * value, with the light ones laid over it), and only the values that differ
 * go under the dark selector. Two `:root` blocks would let the later one win
 * on every page, which is how the light theme used to never apply.
 */
export function renderItemCss(
  item: Pick<RegistryItem, "cssVars" | "css">,
  major: TailwindMajor,
  darkSelector?: string
): string {
  const parts: string[] = []
  const vars = item.cssVars

  if (vars?.theme && major === 4) {
    parts.push(block("@theme", vars.theme))
  }
  if (vars?.light && vars.dark) {
    const root = { ...vars.dark, ...vars.light }
    parts.push(block(":root", root))
    const darkOnly = Object.fromEntries(
      Object.entries(vars.dark).filter(([key, value]) => root[key] !== value)
    )
    if (Object.keys(darkOnly).length > 0) {
      parts.push(darkBlock(resolveDarkSelector(darkSelector), darkOnly))
    }
  } else if (vars?.light) {
    parts.push(block(":root", vars.light))
  } else if (vars?.dark) {
    // Nothing to switch between: the dark set is the only set.
    parts.push(block(":root", vars.dark))
  }
  if (item.css) {
    for (const [selector, body] of Object.entries(item.css)) {
      if (body instanceof Object) {
        // SAFETY: `registryItemCssSchema` allows a `css` entry to be either a
        // string or a plain object of CSS custom properties; `body` is not a
        // string here (excluded by the `instanceof Object` check above), so it
        // is always that key/value record, never an array or class instance.
        parts.push(block(selector, body as Record<string, string | number>))
      } else {
        parts.push(`${selector} {\n${indent(body)}\n}`)
      }
    }
  }

  return parts.length > 0 ? `${parts.join("\n\n")}\n` : ""
}

function darkBlock(
  selector: string,
  entries: Record<string, string | number>
): string {
  if (selector.startsWith("@media")) {
    return `${selector} {\n${indent(block(":root", entries))}\n}`
  }
  return block(selector, entries)
}

function block(
  selector: string,
  entries: Record<string, string | number>
): string {
  const body = Object.entries(entries)
    .map(([key, value]) => `  ${cssProperty(key)}: ${String(value)};`)
    .join("\n")
  return `${selector} {\n${body}\n}`
}

/** `newt-brand` and `--newt-brand` both mean the same custom property. */
function cssProperty(key: string): string {
  return key.startsWith("--") ? key : `--${key}`
}

function indent(value: string): string {
  return value
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join("\n")
}
