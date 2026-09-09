import { describe, expect, it } from "vitest"

import { DEFAULT_PRESET, PRESET_MARKER } from "../preset.js"
import { presetWriteKind, withPreset } from "./update-preset.js"

const TOKENS = `@import "tailwindcss";

@layer base {
  :root {
    --newt-bg-base: #1e1f22;
  }
}
`

describe("withPreset", () => {
  it("appends after the tokens it overrides", () => {
    const result = withPreset(TOKENS, DEFAULT_PRESET)
    expect(result.startsWith(TOKENS.replace(/\s*$/, "\n"))).toBe(true)
    expect(result.indexOf("--newt-bg-base")).toBeLessThan(
      result.indexOf("--newt-brand:")
    )
  })

  it("replaces a block that is already there instead of stacking a second", () => {
    const once = withPreset(TOKENS, DEFAULT_PRESET)
    const twice = withPreset(once, { ...DEFAULT_PRESET, b: "#eb459e" })

    expect(twice.split(PRESET_MARKER)).toHaveLength(2)
    expect(twice).toContain("--newt-brand: #eb459e;")
    expect(twice).not.toContain("--newt-brand: #5865f2;")
  })

  it("reports which of the two it will do", () => {
    expect(presetWriteKind(TOKENS)).toBe("added")
    expect(presetWriteKind(withPreset(TOKENS, DEFAULT_PRESET))).toBe("replaced")
  })

  it("leaves a stylesheet with no trailing newline valid", () => {
    const result = withPreset('@import "tailwindcss";', DEFAULT_PRESET)
    expect(result).toContain('@import "tailwindcss";\n')
    expect(result).toContain(":root {")
  })
})
