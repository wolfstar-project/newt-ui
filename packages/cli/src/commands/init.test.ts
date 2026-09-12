import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { detectCssPath, toNuxtCssAlias } from "./init.js"

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

describe("detectCssPath", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-init-css-"))
  })

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true })
  })

  it("defaults a Nuxt project with no existing stylesheet to app/, absent any other signal", async () => {
    expect(await detectCssPath(cwd, "vue", "nuxt")).toBe(
      "app/assets/css/main.css"
    )
  })

  it("follows a custom srcDir instead of the hardcoded app/ default", async () => {
    await writeFile(
      path.resolve(cwd, "nuxt.config.ts"),
      `export default defineNuxtConfig({ srcDir: "source/" })\n`
    )
    expect(await detectCssPath(cwd, "vue", "nuxt")).toBe(
      "source/assets/css/main.css"
    )
  })

  it("an override always wins, regardless of srcDir detection", async () => {
    expect(await detectCssPath(cwd, "vue", "nuxt", "custom.css")).toBe(
      "custom.css"
    )
  })
})
