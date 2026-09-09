import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import {
  DEFAULT_TYPESET,
  FONT_CHOICES,
  matchesPreset,
  NO_LOCKS,
  parseTypeset,
  PRESET_RHYTHM,
  RHYTHM_RANGES,
  shuffleTypeset,
  typesetCss,
  typesetSearch,
  typesetSnippet,
  typesetVariables,
  withPreset,
  type TypesetParams,
} from "./typeset"

const here = path.dirname(fileURLToPath(import.meta.url))

/* The stylesheet the registry ships, which the builder can only override. */
const stylesheet = readFileSync(
  path.resolve(
    here,
    "../../../../packages/cli/registry/html/components/typeset.css"
  ),
  "utf8"
)

describe("the URL round trip", () => {
  it("restores every control", () => {
    const params: TypesetParams = {
      preset: "article",
      body: "serif",
      heading: "display",
      mono: "system",
      size: 1.125,
      leading: 1.5,
      flow: 1.75,
      measure: "55ch",
    }
    expect(parseTypeset(`?${typesetSearch(params)}`)).toEqual(params)
  })

  it("opens at the defaults when the link no longer parses", () => {
    expect(parseTypeset("?size=42&body=comic")).toEqual(DEFAULT_TYPESET)
  })

  it("opens at the defaults when there is no query at all", () => {
    expect(parseTypeset("")).toEqual(DEFAULT_TYPESET)
  })
})

describe("presets", () => {
  it("carries the numbers the stylesheet declares", () => {
    for (const [preset, rhythm] of Object.entries(PRESET_RHYTHM)) {
      const block = stylesheet.slice(stylesheet.indexOf(`.typeset-${preset} {`))
      expect(block).toContain(`--typeset-size: ${rhythm.size}em;`)
      expect(block).toContain(`--typeset-leading: ${rhythm.leading};`)
      expect(block).toContain(`--typeset-flow: ${rhythm.flow}em;`)
    }
  })

  it("resets the numbers when the preset changes", () => {
    const custom: TypesetParams = { ...DEFAULT_TYPESET, size: 1.25 }
    expect(matchesPreset(custom)).toBe(false)
    expect(matchesPreset(withPreset(custom, "chat"))).toBe(true)
  })
})

describe("what it emits", () => {
  it("declares only --typeset-* properties", () => {
    for (const { property } of typesetVariables(DEFAULT_TYPESET)) {
      expect(property.startsWith("--typeset-")).toBe(true)
    }
  })

  it("resolves fonts to tokens rather than to families", () => {
    const css = typesetCss(DEFAULT_TYPESET)
    expect(css).toContain("--typeset-font-body: var(--newt-font-sans);")
    expect(css).toContain("--typeset-font-heading: var(--newt-font-display);")
  })

  it("names the class the snippet then uses", () => {
    const css = typesetCss(DEFAULT_TYPESET, "typeset-brief")
    expect(css.startsWith(".typeset-brief {")).toBe(true)
    expect(typesetSnippet("react", DEFAULT_TYPESET, "typeset-brief")).toContain(
      'className="typeset-brief"'
    )
  })

  it("writes the plain flavour as class names only", () => {
    const html = typesetSnippet("html", DEFAULT_TYPESET)
    expect(html).toContain(
      "typeset typeset-docs typeset-custom typeset-measure"
    )
    expect(html).not.toContain("<Typeset")
  })

  it("drops the measure class when there is no measure", () => {
    const html = typesetSnippet("html", { ...DEFAULT_TYPESET, measure: "none" })
    expect(html).not.toContain("typeset-measure")
  })
})

/* A fixed sequence, so the assertions are about the rules and not luck. */
function sequence(values: readonly number[]): () => number {
  let index = 0
  return () => values[index++ % values.length] ?? 0
}

describe("shuffle", () => {
  it("leaves every locked control alone", () => {
    const locked = { ...NO_LOCKS, body: true, size: true }
    const next = shuffleTypeset(
      DEFAULT_TYPESET,
      locked,
      sequence([0.9, 0.1, 0.5, 0.2, 0.8, 0.3])
    )
    expect(next.body).toBe(DEFAULT_TYPESET.body)
    expect(next.size).toBe(DEFAULT_TYPESET.size)
  })

  it("keeps every number inside the slider's range", () => {
    for (let seed = 0; seed < 20; seed += 1) {
      const next = shuffleTypeset(DEFAULT_TYPESET, NO_LOCKS)
      for (const key of ["size", "leading", "flow"] as const) {
        expect(next[key]).toBeGreaterThanOrEqual(RHYTHM_RANGES[key].min)
        expect(next[key]).toBeLessThanOrEqual(RHYTHM_RANGES[key].max)
      }
      expect(FONT_CHOICES).toContain(next.body)
    }
  })

  it("survives the top of the range", () => {
    const next = shuffleTypeset(DEFAULT_TYPESET, NO_LOCKS, () => 0.999999)
    expect(next.size).toBe(RHYTHM_RANGES.size.max)
    expect(next.leading).toBe(RHYTHM_RANGES.leading.max)
  })
})
