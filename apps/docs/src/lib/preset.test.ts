import { readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { describe, expect, it } from "vitest"

import {
  applyCommand,
  decodePreset,
  DEFAULT_PRESET,
  encodePreset,
  presetSchema,
  presetCommands,
  PresetError,
  presetToCss,
  presetVariables,
  templateFor,
  type Preset,
} from "./preset"

const here = path.dirname(fileURLToPath(import.meta.url))
const fixturePath = path.resolve(here, "__fixtures__/presets.json")
const fixtureText = readFileSync(fixturePath, "utf8")

interface FixtureCase {
  readonly name: string
  readonly code: string
  readonly css: string
  readonly preset: Preset
}

const cases: FixtureCase[] = JSON.parse(fixtureText).cases.map(
  (entry: { name: string; code: string; css: string; preset: unknown }) => ({
    name: entry.name,
    code: entry.code,
    css: entry.css,
    preset: presetSchema.parse(entry.preset),
  })
)

describe("the codec the CLI also implements", () => {
  it.each(cases.map((entry) => [entry.name, entry] as const))(
    "encodes %s to the code the CLI produces",
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

  it.each(cases.map((entry) => [entry.name, entry] as const))(
    "renders %s to the CSS `newtui preset css` prints",
    (_name, entry) => {
      expect(presetToCss(entry.preset)).toBe(entry.css)
    }
  )

  it("is pinned to the CLI's copy of the fixture", () => {
    const cliFixture = path.resolve(
      here,
      "../../../../packages/cli/src/utils/__fixtures__/presets.json"
    )
    expect(readFileSync(cliFixture, "utf8")).toBe(fixtureText)
  })
})

describe("decodePreset", () => {
  it.each([
    ["a code without the prefix", "eyJ2IjoxfQ"],
    ["a payload that is not JSON", "nt1.bm90LWpzb24"],
    ["a payload missing a field", "nt1.eyJ2IjoxLCJ0IjoibmV4dCJ9"],
    ["a framework this site does not have", "nt1.eyJ2IjoxLCJ0IjoicmVtaXgifQ"],
  ])("rejects %s", (_label, code) => {
    expect(() => decodePreset(code)).toThrow(PresetError)
  })

  it("round-trips every axis at once", () => {
    const preset: Preset = {
      ...DEFAULT_PRESET,
      t: "nuxt",
      b: "#1abc9c",
      r: "sm",
      f: "mono-first",
      m: "light",
      d: "rtl",
    }
    expect(decodePreset(encodePreset(preset))).toEqual(preset)
  })
})

describe("what the builder prints", () => {
  it("uses one command for a framework with a template", () => {
    expect(presetCommands(DEFAULT_PRESET, "pnpm")).toEqual([
      `pnpm dlx newtui@latest init --template next --preset ${encodePreset(DEFAULT_PRESET)}`,
    ])
  })

  it("scaffolds first for a framework without one", () => {
    const preset: Preset = { ...DEFAULT_PRESET, t: "laravel" }
    const commands = presetCommands(preset, "npm")
    expect(commands).toHaveLength(2)
    expect(commands[0]).toBe("npx laravel new")
    expect(commands[1]).not.toContain("--template")
  })

  it("has no command for the two flavours that never run init", () => {
    for (const framework of ["manual", "html"] as const) {
      const commands = presetCommands(
        { ...DEFAULT_PRESET, t: framework },
        "pnpm"
      )
      expect(commands).toEqual([
        `pnpm dlx newtui@latest init --preset ${encodePreset({ ...DEFAULT_PRESET, t: framework })}`,
      ])
    }
  })

  it("names apply for a project that already ran init", () => {
    expect(applyCommand(DEFAULT_PRESET, "bun")).toBe(
      `bunx newtui@latest apply --preset ${encodePreset(DEFAULT_PRESET)}`
    )
  })

  it("knows which frameworks have a template", () => {
    expect(templateFor(DEFAULT_PRESET)).toBe("next")
    expect(templateFor({ ...DEFAULT_PRESET, t: "astro" })).toBeUndefined()
  })
})

describe("presetVariables", () => {
  it("declares only --newt-* properties", () => {
    for (const { property } of presetVariables(DEFAULT_PRESET)) {
      expect(property.startsWith("--newt-")).toBe(true)
    }
  })

  it("matches the values the CSS block writes", () => {
    const preset: Preset = { ...DEFAULT_PRESET, b: "#eb459e", r: "lg" }
    const css = presetToCss(preset)
    for (const { property, value } of presetVariables(preset)) {
      expect(css).toContain(`${property}: ${value};`)
    }
  })
})
