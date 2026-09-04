import path from "node:path"
import { fileURLToPath } from "node:url"

import { pathExists, readTextFile } from "./fileSystem.js"

/**
 * Locate `registry/html/tokens.css` shipped with this package.
 * Works both from `dist/index.js` (published) and `src/tools/tokens.ts` (dev).
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

/**
 * Extract the `:root { --newt-* }` block from tokens.css, wrapped for Tailwind `@layer base`.
 */
export async function getTokensCssBlock(): Promise<string> {
  const raw = await readTextFile(getTokensPath())
  const match = raw.match(/:root\s*\{[\s\S]*?\n\}/)
  const rootBlock = match ? match[0] : raw
  const indented = rootBlock
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join("\n")
  return [
    "",
    "/* newt/ui design tokens — source of truth: newt-ui/registry/html/tokens.css */",
    "@layer base {",
    indented,
    "",
    "  .newt-root {",
    "    font-family: var(--newt-font-sans);",
    "    color: var(--newt-text-primary);",
    "    -webkit-font-smoothing: antialiased;",
    "  }",
    "}",
    "",
  ].join("\n")
}

export const TOKENS_MARKER = "--newt-bg-base"
