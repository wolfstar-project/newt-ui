import path from "node:path"

import { findFirstExisting, readTextFile, writeFileAt } from "../fileSystem.js"
import { detectNuxtBaseDir, type Config } from "../get-config.js"
import { NUXT_CONFIG_CANDIDATES } from "../options.js"

/*
 * Nuxt registers every file under `components/` as a component, and names an
 * `index` file after its folder. A copied component folder therefore resolves
 * twice to one name (`ui/tabs/index.ts` and `ui/tabs/Tabs.vue` are both
 * `UiTabs`), and Nuxt warns once per folder (NUXT_B3011). The barrels are only
 * ever imported by path, so the fix is to keep them out of the scan.
 */

/** Used when no `nuxt.config` exists yet and one has to be named. */
const DEFAULT_NUXT_CONFIG = NUXT_CONFIG_CANDIDATES[0]

/**
 * Nuxt's own default directories. An explicit `components` array replaces
 * them, so they are written back: without these two entries a file in
 * `components/global` stops being global and is renamed `Global…`.
 */
const NUXT_DEFAULT_DIRS = [
  '{ path: "~/components/islands", island: true }',
  '{ path: "~/components/global", global: true }',
] as const

/** The barrel `add` writes into each Vue component folder. */
export function barrelFileName(typescript: boolean): string {
  return typescript ? "index.ts" : "index.js"
}

/**
 * The glob, relative to the Nuxt `components` directory, that matches the
 * barrels `add` writes. `undefined` when the ui directory is not inside that
 * directory: Nuxt does not scan it, so there is nothing to ignore.
 */
export function barrelIgnorePattern(input: {
  /** Absolute path of `<srcDir>/components`. */
  componentsDir: string
  /** Absolute path the `ui` alias of `components.json` resolves to. */
  uiDir: string
  typescript: boolean
}): string | undefined {
  const relative = path.relative(input.componentsDir, input.uiDir)
  if (
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    return undefined
  }
  return [
    ...relative.split(path.sep).filter((segment) => segment.length > 0),
    "**",
    barrelFileName(input.typescript),
  ].join("/")
}

type Quote = '"' | "'"

/**
 * `value` as a JavaScript string literal in `quote`. The pattern follows the ui
 * alias, so it can hold a quote or a backslash that must not end the string.
 */
export function stringLiteral(value: string, quote: Quote = '"'): string {
  const double = JSON.stringify(value)
  if (quote === '"') return double
  const body = double.slice(1, -1).replaceAll('\\"', '"').replaceAll("'", "\\'")
  return `'${body}'`
}

/** The `components` option for `nuxt.config`, without a trailing comma. */
export function componentsOption(
  ignore: string,
  indent = "  ",
  quote: Quote = '"'
): string {
  const dirs =
    quote === '"'
      ? NUXT_DEFAULT_DIRS
      : NUXT_DEFAULT_DIRS.map((entry) => entry.replaceAll('"', "'"))
  return [
    "components: [",
    ...[
      ...dirs,
      `{ path: ${stringLiteral("~/components", quote)}, ignore: [${stringLiteral(ignore, quote)}] }`,
    ].map((entry) => `${indent}${entry},`),
    "]",
  ].join("\n")
}

/**
 * Replace every comment with spaces, keeping each offset where it was. String
 * literals are walked rather than matched: a glob inside one holds both
 * comment markers (the ignore pattern written below does) and must survive.
 */
function blankComments(source: string): string {
  let out = ""
  let index = 0
  while (index < source.length) {
    const char = source.charAt(index)
    const next = source.charAt(index + 1)

    if (char === '"' || char === "'" || char === "`") {
      const end = stringEnd(source, index)
      out += source.slice(index, end)
      index = end
    } else if (char === "/" && next === "/") {
      const newline = source.indexOf("\n", index)
      const end = newline === -1 ? source.length : newline
      out += source.slice(index, end).replace(/[^\r]/g, " ")
      index = end
    } else if (char === "/" && next === "*") {
      const close = source.indexOf("*/", index + 2)
      const end = close === -1 ? source.length : close + 2
      out += source.slice(index, end).replace(/[^\r\n]/g, " ")
      index = end
    } else {
      out += char
      index += 1
    }
  }
  return out
}

/** The offset just past the string literal that opens at `start`. */
function stringEnd(source: string, start: number): number {
  const quote = source.charAt(start)
  let index = start + 1
  while (index < source.length) {
    const char = source.charAt(index)
    if (char === "\\") {
      index += 2
    } else if (char === quote) {
      return index + 1
    } else if (char === "\n" && quote !== "`") {
      // An unterminated quote cannot span lines; stop so one stray quote
      // does not hide the rest of the file.
      return index
    } else {
      index += 1
    }
  }
  return source.length
}

type ManualReason =
  /** The config already sets `components`; merging into it is the owner's call. */
  | "components-option"
  /** A top-level `...spread` may set `components` and replace the inserted option. */
  | "spread"
  /** No single multi-line `defineNuxtConfig({` to write into. */
  | "config-shape"

export type NuxtConfigEdit =
  | { readonly _tag: "Edited"; readonly source: string }
  | { readonly _tag: "AlreadyIgnored" }
  | { readonly _tag: "Manual"; readonly reason: ManualReason }

const COMPONENTS_KEY = /\bcomponents["'`]?\s*:/
const CONFIG_OPENING = /defineNuxtConfig\(\s*\{/g

/**
 * Whether the object that opens just before `start` spreads another object
 * into itself. Only its own level counts: a spread inside an option, such as
 * `modules: [...base]`, cannot replace `components`.
 */
function spreadsAtTopLevel(code: string, start: number): boolean {
  let depth = 0
  let index = start
  while (index < code.length) {
    const char = code.charAt(index)
    if (char === '"' || char === "'" || char === "`") {
      index = stringEnd(code, index)
      continue
    }
    if ("{[(".includes(char)) {
      depth += 1
    } else if ("}])".includes(char)) {
      if (depth === 0) return false
      depth -= 1
    } else if (depth === 0 && code.startsWith("...", index)) {
      return true
    }
    index += 1
  }
  return false
}

/**
 * Add the `components` option to a `nuxt.config` source. The edit is text, not
 * a parse, so it only happens where it cannot go wrong: one
 * `defineNuxtConfig({` that ends its line, no top-level spread, and no
 * `components` key anywhere.
 * Every other shape is reported back for the reader to do by hand.
 */
export function ignoreBarrels(source: string, ignore: string): NuxtConfigEdit {
  const code = blankComments(source)

  if (COMPONENTS_KEY.test(code)) {
    const written = [ignore, stringLiteral(ignore, "'"), stringLiteral(ignore)]
    return written.some((form) => code.includes(form))
      ? { _tag: "AlreadyIgnored" }
      : { _tag: "Manual", reason: "components-option" }
  }

  const openings = [...code.matchAll(CONFIG_OPENING)]
  const opening = openings.length === 1 ? openings[0] : undefined
  if (opening === undefined) return { _tag: "Manual", reason: "config-shape" }

  const afterBrace = opening.index + opening[0].length
  if (spreadsAtTopLevel(code, afterBrace)) {
    return { _tag: "Manual", reason: "spread" }
  }
  const lineEnd = /^[ \t]*(\r?\n)/.exec(code.slice(afterBrace))
  const eol = lineEnd?.[1]
  if (lineEnd === null || eol === undefined) {
    return { _tag: "Manual", reason: "config-shape" }
  }

  const insertAt = afterBrace + lineEnd[0].length
  // Options sit one level deep, so the first one's indentation is the unit.
  const sibling = /^(?:[ \t]*\r?\n)*([ \t]+)[^\s}]/.exec(source.slice(insertAt))
  const indent = sibling?.[1] ?? "  "
  // `create-nuxt` writes single quotes; follow the file rather than fight it.
  const quote = code.includes("'") && !code.includes('"') ? "'" : '"'
  const option = componentsOption(ignore, indent, quote)
    .split("\n")
    .map((line) => `${indent}${line}`)
    .join(eol)

  return {
    _tag: "Edited",
    source: `${source.slice(0, insertAt)}${option},${eol}${source.slice(insertAt)}`,
  }
}

export type NuxtBarrels =
  /** Nuxt does not scan the ui directory; the barrels are never registered. */
  | { readonly _tag: "NotScanned" }
  | { readonly _tag: "Edited"; readonly file: string }
  | { readonly _tag: "AlreadyIgnored"; readonly file: string }
  | {
      readonly _tag: "Manual"
      readonly reason: ManualReason
      readonly file: string
      readonly ignore: string
    }

/**
 * Keep the barrels `add` writes out of Nuxt's component scan, by editing the
 * project's `nuxt.config` when that is safe. `file` is relative to the project.
 */
export async function updateNuxtConfig(config: Config): Promise<NuxtBarrels> {
  const { cwd, ui } = config.resolvedPaths
  const baseDir = await detectNuxtBaseDir(cwd)
  const ignore = barrelIgnorePattern({
    componentsDir: path.resolve(cwd, baseDir ?? ".", "components"),
    uiDir: ui,
    typescript: config.typescript,
  })
  if (ignore === undefined) return { _tag: "NotScanned" }

  const file = findFirstExisting(cwd, NUXT_CONFIG_CANDIDATES)
  if (file === undefined) {
    return {
      _tag: "Manual",
      reason: "config-shape",
      file: DEFAULT_NUXT_CONFIG,
      ignore,
    }
  }

  const target = path.resolve(cwd, file)
  const edit = ignoreBarrels(await readTextFile(target), ignore)
  if (edit._tag === "Manual") {
    return { _tag: "Manual", reason: edit.reason, file, ignore }
  }
  if (edit._tag === "Edited") await writeFileAt(target, edit.source)
  return { _tag: edit._tag, file }
}
