import { describe, expect, it } from "vitest"

import { toNuxtCssAlias } from "./init.js"

describe("toNuxtCssAlias", () => {
  it.each([
    ["app/assets/css/main.css", "~/assets/css/main.css"],
    ["src/assets/css/main.css", "~/assets/css/main.css"],
    ["assets/css/main.css", "~/assets/css/main.css"],
    ["~/assets/css/main.css", "~/assets/css/main.css"],
  ])("maps %s to %s", (css, expected) => {
    expect(toNuxtCssAlias(css)).toBe(expected)
  })
})
