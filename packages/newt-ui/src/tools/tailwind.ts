import path from "node:path"

import { findFirstExisting, readFileIfExists } from "./fileSystem.js"
import { TAILWIND_CONFIG_CANDIDATES } from "./options.js"
import type { RegistryItem } from "./schema.js"

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

function readTailwindRange(packageJson: string): string | undefined {
  let parsed: unknown
  try {
    parsed = JSON.parse(packageJson)
  } catch {
    return undefined
  }
  if (!isRecord(parsed)) return undefined
  for (const field of ["dependencies", "devDependencies"] as const) {
    const deps = parsed[field]
    if (!isRecord(deps)) continue
    const value = deps["tailwindcss"]
    if (typeof value === "string") return value
  }
  return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function majorFromRange(range: string): TailwindMajor | undefined {
  const match = /(\d+)/.exec(range)
  if (!match?.[1]) return undefined
  const major = Number.parseInt(match[1], 10)
  return TAILWIND_MAJORS.find((candidate) => candidate === major)
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
 * Render an item's `cssVars` and `css` into a stylesheet block.
 *
 * On v4 the theme entries become an `@theme` block, which is what generates
 * the `bg-newt-*` / `rounded-*` / `shadow-*` utilities — there is no JS config
 * to extend. On v3 those same utilities come from the preset in
 * `tailwind.config`, so only the raw custom properties are written here.
 */
export function renderItemCss(
  item: Pick<RegistryItem, "cssVars" | "css">,
  major: TailwindMajor
): string {
  const parts: string[] = []
  const vars = item.cssVars

  if (vars?.theme && major === 4) {
    parts.push(block("@theme", vars.theme))
  }
  if (vars?.light) {
    parts.push(block(":root", vars.light))
  }
  if (vars?.dark) {
    // The library is dark-first: the tokens are the default, and `.dark`
    // carries them too so a class-based toggle keeps working.
    parts.push(block(":root", vars.dark))
    parts.push(block(".dark", vars.dark))
  }
  if (item.css) {
    for (const [selector, body] of Object.entries(item.css)) {
      parts.push(
        typeof body === "string"
          ? `${selector} {\n${indent(body)}\n}`
          : block(selector, body as Record<string, unknown>)
      )
    }
  }

  return parts.length > 0 ? `${parts.join("\n\n")}\n` : ""
}

function block(selector: string, entries: Record<string, unknown>): string {
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
