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
