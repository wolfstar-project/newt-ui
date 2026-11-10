import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

const root = resolve(import.meta.dirname, "../../../..")
const read = (path: string) => readFileSync(resolve(root, path), "utf8")

/*
 * The Nuxt UI theme is a registry item made of references to newt/ui tokens.
 * A token renamed or removed in `tokens.css` would leave it pointing at
 * nothing, and nothing would fail: an unset custom property is simply
 * ignored. These tests are what fails instead.
 */
const declared = new Set(
  read("packages/cli/registry/html/tokens.css").match(/--newt-[a-z0-9-]+(?=:)/g)
)

function tokensIn(source: string): string[] {
  return [...new Set(source.match(/--newt-[a-z0-9-]+/g))]
}

describe("the Nuxt UI theme", () => {
  it.each([
    "apps/vue/app/lib/nuxt-ui.ts",
    "apps/vue/registry/registry-nuxt-ui.ts",
  ])("%s only references tokens that exist", (file) => {
    const tokens = tokensIn(read(file))
    expect(tokens.length).toBeGreaterThan(0)
    expect(tokens.filter((token) => !declared.has(token))).toEqual([])
  })

  it("is published by the Vue registry as a lib item with its stylesheet", () => {
    const lib = read("apps/vue/registry/registry-lib.ts")
    expect(lib).toContain('name: "nuxt-ui-theme"')
    expect(lib).toContain('{ path: "lib/nuxt-ui.ts", type: "registry:lib" }')
    expect(lib).toContain("css: { [NUXT_UI_SELECTOR]: nuxtUiVars }")
  })

  it("maps every --ui-* variable to a token or a literal colour", () => {
    const source = read("apps/vue/registry/registry-nuxt-ui.ts")
    const names = source.match(/"--ui-[a-z-]+"(?=:)/g) ?? []
    const entries = [...source.matchAll(/"(--ui-[a-z-]+)":\s*"([^"]*)"/g)]

    expect(names.length).toBeGreaterThanOrEqual(20)
    expect(new Set(names).size).toBe(names.length)
    /* Every key was read together with a string value, so none is skipped. */
    expect(entries.length).toBe(names.length)

    /*
     * A value is either built on a declared token or is one of the literal
     * colours the theme keeps. Anything else, an empty string included, is
     * a variable Nuxt UI would silently fall back from.
     */
    const broken = entries.filter(([, , value = ""]) => {
      const tokens = tokensIn(value)
      if (tokens.length > 0) return tokens.some((token) => !declared.has(token))
      return !/^#[0-9a-f]{3,8}$/i.test(value)
    })
    expect(broken.map(([, name]) => name)).toEqual([])
  })
})
