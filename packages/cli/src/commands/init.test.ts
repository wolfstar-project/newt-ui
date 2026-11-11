import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import { detectCssPath, init, toNuxtCssAlias } from "./init.js"

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

/*
 * The registry is pointed at a closed port, so `init` takes its offline path:
 * the tokens bundled with the package, rendered by the same function as the
 * registry theme.
 */
const OFFLINE_REGISTRY = "http://127.0.0.1:9"

describe("init stylesheet", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-init-"))
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({
        dependencies: { nuxt: "^4.0.0", tailwindcss: "^4.1.0" },
      })
    )
    await writeFile(path.join(cwd, "nuxt.config.ts"), "export default {}\n")
  })

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true })
  })

  async function runInit(extra: { css: string; darkSelector?: string }) {
    await init({
      cwd,
      yes: true,
      defaults: true,
      skipInstall: true,
      registry: OFFLINE_REGISTRY,
      ...extra,
    })
    return readFile(path.join(cwd, extra.css), "utf8")
  }

  it("does not import Tailwind into a token file when another stylesheet does", async () => {
    await mkdir(path.join(cwd, "app/assets/css"), { recursive: true })
    await writeFile(
      path.join(cwd, "app/assets/css/main.css"),
      '@import "tailwindcss";\n'
    )

    const css = await runInit({ css: "app/assets/css/newt.css" })

    expect(css).not.toContain("tailwindcss")
    expect(css).toContain("--newt-bg-base")
  })

  it("starts a new stylesheet with Tailwind when nothing loads it yet", async () => {
    const css = await runInit({ css: "app/assets/css/main.css" })

    expect(css.startsWith('@import "tailwindcss";')).toBe(true)
  })

  it("writes a single light :root and the dark values under the chosen selector", async () => {
    const css = await runInit({
      css: "app/assets/css/main.css",
      darkSelector: "data-theme",
    })

    expect(css.match(/^:root \{/gm)).toHaveLength(1)
    const root = css.slice(css.indexOf(":root {"))
    expect(root).toContain("--newt-bg-base: #e3e5e8;")
    expect(root).toContain("--newt-brand: #5865f2;")
    expect(css).toContain('[data-theme="dark"] {\n  --newt-bg-base: #1e1f22;')
    const config = JSON.parse(
      await readFile(path.join(cwd, "components.json"), "utf8")
    )
    expect(config.tailwind.darkSelector).toBe("data-theme")
  })
})
