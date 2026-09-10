import { existsSync } from "node:fs"
import { resolve } from "node:path"

import { describe, expect, it } from "vitest"

const root = resolve(import.meta.dirname, "../../../..")

describe("repository registry layout", () => {
  it.each(["www", "vue"])(
    "keeps the %s registry at the app root using the shared base layout",
    (app) => {
      const registry = resolve(root, "apps", app, "registry", "bases", "newt")

      expect(existsSync(resolve(registry, "ui"))).toBe(true)
      expect(existsSync(resolve(registry, "blocks"))).toBe(true)
      expect(existsSync(resolve(registry, "examples"))).toBe(true)
      expect(existsSync(resolve(root, "apps", app, "registry.json"))).toBe(true)
    }
  )

  it("keeps generated Vue loaders outside the Nuxt app source directory", () => {
    expect(existsSync(resolve(root, "apps/vue/__registry__/index.ts"))).toBe(
      true
    )
    expect(existsSync(resolve(root, "apps/vue/app/lib/registry"))).toBe(false)
  })
})
