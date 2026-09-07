import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

/*
 * The HTML/CSS registry is the visual spec the React and Vue versions are
 * written against, so a physical property reintroduced here reaches all three.
 * A right-to-left reader would see it before anyone else does; this catches it
 * at the commit instead.
 */
const COMPONENTS = fileURLToPath(
  new URL("../registry/html/components", import.meta.url)
)

const PHYSICAL =
  /(?<![\w-])(margin|padding|border)-(left|right)\b|(?<![\w-])border-(top|bottom)-(left|right)-radius\b|^\s*(left|right)\s*:|text-align\s*:\s*(left|right)\b/gm

/** A sideways transform must carry the direction multiplier, not a raw sign. */
const RAW_TRANSLATE_X = /translateX\(\s*-?[\d.]/g

const files = readdirSync(COMPONENTS)
  .filter((file) => file.endsWith(".css"))
  .toSorted()

describe("the HTML registry uses logical properties", () => {
  it("has stylesheets to check", () => {
    expect(files.length).toBeGreaterThan(40)
  })

  it.each(files)("%s has no physical inline directions", (file) => {
    const css = readFileSync(path.join(COMPONENTS, file), "utf8")
    expect(css.match(PHYSICAL) ?? []).toEqual([])
  })

  it.each(files)("%s flips its sideways transforms", (file) => {
    const css = readFileSync(path.join(COMPONENTS, file), "utf8")
    expect(css.match(RAW_TRANSLATE_X) ?? []).toEqual([])
  })
})

describe("tokens.css", () => {
  const tokens = readFileSync(
    fileURLToPath(new URL("../registry/html/tokens.css", import.meta.url)),
    "utf8"
  )

  it("declares the direction multiplier", () => {
    expect(tokens).toContain("--newt-dir: 1;")
  })

  it("flips it for right-to-left subtrees", () => {
    expect(tokens).toMatch(/\[dir="rtl"\]\s*\{\s*--newt-dir:\s*-1;/)
  })
})
