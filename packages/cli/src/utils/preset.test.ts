import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import {
  decodePreset,
  DEFAULT_PRESET,
  encodePreset,
  PresetError,
  presetSchema,
  presetToCss,
  templateFor,
  type Preset,
} from "./preset.js"

const here = path.dirname(fileURLToPath(import.meta.url))

interface FixtureCase {
  readonly name: string
  readonly code: string
  readonly preset: Preset
}

const fixturePath = path.resolve(here, "__fixtures__/presets.json")
const fixtureText = readFileSync(fixturePath, "utf8")
const cases: FixtureCase[] = JSON.parse(fixtureText).cases.map(
  (entry: { name: string; code: string; preset: unknown }) => ({
    name: entry.name,
    code: entry.code,
    preset: presetSchema.parse(entry.preset),
  })
)

describe("preset codec", () => {
  it.each(cases.map((entry) => [entry.name, entry] as const))(
    "encodes %s to its golden code",
    (_name, entry) => {
      expect(encodePreset(entry.preset)).toBe(entry.code)
    }
  )

  it.each(cases.map((entry) => [entry.name, entry] as const))(
    "decodes %s back to its values",
    (_name, entry) => {
      expect(decodePreset(entry.code)).toEqual(entry.preset)
    }
  )

  it("round-trips the defaults", () => {
    expect(decodePreset(encodePreset(DEFAULT_PRESET))).toEqual(DEFAULT_PRESET)
  })

  it("accepts an uppercase hue and stores it lowercase", () => {
    const code = encodePreset({ ...DEFAULT_PRESET, b: "#EB459E" })
    expect(decodePreset(code).b).toBe("#eb459e")
  })

  it.each([
    ["a code without the prefix", "eyJ2IjoxfQ"],
    ["a prefix with no payload", "nt1."],
    ["a payload that is not JSON", "nt1.bm90LWpzb24"],
    ["a payload missing a field", "nt1.eyJ2IjoxLCJ0IjoibmV4dCJ9"],
  ])("rejects %s", (_label, code) => {
    expect(() => decodePreset(code)).toThrow(PresetError)
  })
})

describe("templateFor", () => {
  it.each([
    ["next", "next"],
    ["vite-react", "vite-react"],
    ["vite-vue", "vite-vue"],
    ["nuxt", "nuxt"],
  ] as const)("scaffolds %s", (framework, template) => {
    expect(templateFor({ ...DEFAULT_PRESET, t: framework })).toBe(template)
  })

  it.each([
    "astro",
    "tanstack-start",
    "react-router",
    "laravel",
    "manual",
    "html",
  ] as const)("has no template for %s", (framework) => {
    expect(templateFor({ ...DEFAULT_PRESET, t: framework })).toBeUndefined()
  })
})

describe("presetToCss", () => {
  it("writes the three brand steps from one hue", () => {
    const css = presetToCss({ ...DEFAULT_PRESET, b: "#5865f2" })
    expect(css).toContain("--newt-brand: #5865f2;")
    expect(css).toContain("--newt-brand-hover: #4b56ce;")
    expect(css).toContain("--newt-brand-active: #3e47a9;")
  })

  it("carries its own code, so apply can find and replace it", () => {
    const preset: Preset = { ...DEFAULT_PRESET, r: "lg" }
    expect(presetToCss(preset)).toContain(encodePreset(preset))
  })

  it("only mentions light and rtl when they were chosen", () => {
    expect(presetToCss(DEFAULT_PRESET)).not.toContain("color-scheme")
    expect(presetToCss(DEFAULT_PRESET)).not.toContain("--newt-dir")

    const flipped = presetToCss({ ...DEFAULT_PRESET, m: "light", d: "rtl" })
    expect(flipped).toContain("color-scheme: light;")
    expect(flipped).toContain("--newt-dir: -1;")
  })

  it("declares nothing that is not a --newt-* token", () => {
    const css = presetToCss({ ...DEFAULT_PRESET, m: "light" })
    const declarations = [...css.matchAll(/^\s{2}([a-z-]+):/gm)].map(
      (match) => match[1]
    )
    for (const property of declarations) {
      expect(
        property === "color-scheme" || property?.startsWith("--newt-")
      ).toBe(true)
    }
  })
})

describe("the fixture the docs copy", () => {
  it("is byte-identical to apps/docs/src/lib/__fixtures__/presets.json", () => {
    const docsFixture = path.resolve(
      here,
      "../../../../apps/docs/src/lib/__fixtures__/presets.json"
    )
    expect(readFileSync(docsFixture, "utf8")).toBe(fixtureText)
  })
})

describe("the axes added after the first codes", () => {
  it("leaves a default out of the code, so an older code encodes to itself", () => {
    const before = encodePreset(DEFAULT_PRESET)
    expect(atob(before.slice("nt1.".length))).not.toMatch(/"[nhs]":/)
    expect(encodePreset(decodePreset(before))).toBe(before)
  })

  it("fills the defaults in when a code predates them", () => {
    const decoded = decodePreset(encodePreset(DEFAULT_PRESET))
    expect(decoded).toMatchObject({ n: "slate", h: "same", s: "soft" })
  })

  it("restates the light surfaces in :root and the dark ones under the dark selector", () => {
    const css = presetToCss({ ...DEFAULT_PRESET, n: "stone" })
    expect(css).toMatch(/:root \{[^}]*--newt-bg-base: #e9e6e1;/)
    expect(css).toMatch(/\.dark \{\n  --newt-bg-base: #201e1c;/)
    expect(css).not.toContain("data-newt-theme")
  })

  it("follows the project's dark selector", () => {
    const css = presetToCss(
      { ...DEFAULT_PRESET, n: "stone" },
      "@media (prefers-color-scheme: dark)"
    )
    expect(css).toContain("@media (prefers-color-scheme: dark) {\n  :root {")
    expect(css).toContain("    --newt-bg-base: #201e1c;")
  })

  it("tunes the shadows to each surface set", () => {
    const css = presetToCss({ ...DEFAULT_PRESET, s: "deep" })
    expect(css).toMatch(
      /:root \{[^}]*--newt-shadow-elevation-high: 0 16px 40px rgba\(6, 6, 7, 0\.18\);/
    )
    expect(css).toMatch(
      /\.dark \{\n  --newt-shadow-elevation-low: [^\n]*0\.3\)/
    )
  })

  it("writes a shadow both sets share under both, so no selector overrides it", () => {
    const css = presetToCss({ ...DEFAULT_PRESET, s: "flat" })
    expect(css.match(/--newt-shadow-elevation-high/g)).toHaveLength(2)
    expect(css).toMatch(/\.dark \{\n  --newt-shadow-elevation-low: none;/)
  })

  it("lays the HTML target out the way tokens.css is: dark in :root, light opt-in", () => {
    const css = presetToCss({ ...DEFAULT_PRESET, t: "html", n: "stone" })
    expect(css).toMatch(/:root \{[^}]*--newt-bg-base: #201e1c;/)
    expect(css).toMatch(
      /\[data-newt-theme="light"\] \{\n  --newt-bg-base: #e9e6e1;/
    )
    expect(css).not.toContain(".dark")
  })

  it("sets the heading font apart from the body only when one is chosen", () => {
    const same = presetToCss({ ...DEFAULT_PRESET, f: "system" })
    const serif = presetToCss({ ...DEFAULT_PRESET, f: "system", h: "serif" })
    expect(same).toMatch(/--newt-font-display: -apple-system/)
    expect(serif).toMatch(/--newt-font-display: "Iowan Old Style"/)
    expect(serif).toMatch(/--newt-font-sans: -apple-system/)
  })
})
