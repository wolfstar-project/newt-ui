import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

/*
 * `rounded-md` and `font-sans` read the host's Tailwind scale. Nuxt UI sets
 * `--radius-md` to 12px with `@theme inline`, and Tailwind v3 compiles the
 * default to a fixed 6px, so no stylesheet override reaches either. The
 * components read the newt tokens instead, through an arbitrary value that
 * compiles on both majors. This catches the host scale coming back.
 */
const ROOTS = [
  "../../../../apps/www/registry/bases/newt/ui",
  "../../../../apps/www/registry/bases/newt/blocks",
  "../../../../apps/vue/registry/bases/newt/ui",
  "../../../../apps/vue/registry/bases/newt/blocks",
].map((root) => fileURLToPath(new URL(root, import.meta.url)))

const HOST_SCALE =
  /(?<![\w-])(?:rounded(?:-(?:t|r|b|l|s|e|x|y|ss|se|es|ee|tl|tr|br|bl))?-(?:sm|md|lg|xl)|font-(?:sans|mono))(?![\w-])/g

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) return sources(target)
    return /\.(tsx?|vue)$/.test(entry.name) ? [target] : []
  })
}

const files = ROOTS.flatMap(sources).map((file) => ({
  name: path.relative(
    fileURLToPath(new URL("../../../..", import.meta.url)),
    file
  ),
  file,
}))

describe("registry components read the newt radius and font tokens", () => {
  it("has sources to check", () => {
    expect(files.length).toBeGreaterThan(200)
  })

  it.each(files)(
    "$name uses no host-scale radius or font class",
    ({ file }) => {
      expect(readFileSync(file, "utf8").match(HOST_SCALE) ?? []).toEqual([])
    }
  )
})
