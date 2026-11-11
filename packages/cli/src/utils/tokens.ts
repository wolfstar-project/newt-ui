import path from "node:path"
import { fileURLToPath } from "node:url"

import { pathExists, readTextFile } from "./fileSystem.js"
import { renderItemCss } from "./tailwind.js"

/**
 * Locate `registry/html/tokens.css` shipped with this package.
 * Works both from `dist/index.js` (published) and `src/utils/tokens.ts` (dev).
 */
function getTokensPath(): string {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const candidates = [
    path.resolve(here, "../registry/html/tokens.css"),
    path.resolve(here, "../../registry/html/tokens.css"),
  ]
  for (const candidate of candidates) {
    if (pathExists(candidate)) return candidate
  }
  throw new Error(
    "Could not locate registry/html/tokens.css in the newt-ui package."
  )
}

/** The `--name: value;` declarations of one block, comments dropped. */
function declarations(body: string) {
  const entries: Array<[string, string]> = []
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, "")
  for (const match of clean.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    const [, name, value] = match
    if (name && value) entries.push([name, value.replace(/\s+/g, " ").trim()])
  }
  return Object.fromEntries(entries)
}

/**
 * The token block written when the registry is unreachable, built from the
 * `tokens.css` shipped with this package: its `:root` holds the dark set and
 * its `.newt-light` block the light overrides. Rendered through the same
 * function as the registry theme, so the offline output has the same shape:
 * one complete light `:root`, and the dark values under `darkSelector`.
 */
export async function getTokensCssBlock(
  darkSelector?: string
): Promise<string> {
  const raw = await readTextFile(getTokensPath())
  const dark = declarations(raw.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? "")
  const light = declarations(
    raw.match(/\.newt-light,[^{]*\{([\s\S]*?)\n\}/)?.[1] ?? ""
  )
  const rendered = renderItemCss(
    { cssVars: Object.keys(light).length > 0 ? { dark, light } : { dark } },
    3,
    darkSelector
  )
  return [
    "",
    "/* newt/ui design tokens — source of truth: newt-ui/registry/html/tokens.css */",
    rendered,
    ".newt-root {",
    "  font-family: var(--newt-font-sans);",
    "  color: var(--newt-text-primary);",
    "  -webkit-font-smoothing: antialiased;",
    "}",
    "",
  ].join("\n")
}

export const TOKENS_MARKER = "--newt-bg-base"
