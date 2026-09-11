import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  detectNuxtBaseDir,
  rawConfigSchema,
  resolveConfigPaths,
} from "./get-config.js"

function nuxtConfig(cwd: string, defaults = { framework: "vue" as const }) {
  return rawConfigSchema.parse({
    style: "default",
    framework: defaults.framework,
    bundler: "nuxt",
    typescript: true,
    tailwind: {
      config: "tailwind.config.ts",
      css: "app/assets/css/main.css",
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      ui: "@/components/ui",
      lib: "@/lib",
      composables: "@/composables",
    },
  })
}

describe("resolveConfigPaths — Nuxt srcDir detection", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-get-config-"))
  })

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true })
  })

  it("resolves under app/ when the project already has that directory (Nuxt 4 on disk)", async () => {
    await mkdir(path.resolve(cwd, "app"), { recursive: true })
    const config = await resolveConfigPaths(cwd, nuxtConfig(cwd))
    expect(config.resolvedPaths.components).toBe(
      path.resolve(cwd, "app/components")
    )
    expect(config.resolvedPaths.utils).toBe(path.resolve(cwd, "app/lib/utils"))
  })

  it("resolves under app/ for a fresh project whose package.json declares Nuxt 4", async () => {
    await writeFile(
      path.resolve(cwd, "package.json"),
      JSON.stringify({ dependencies: { nuxt: "^4.2.0" } })
    )
    const config = await resolveConfigPaths(cwd, nuxtConfig(cwd))
    expect(config.resolvedPaths.components).toBe(
      path.resolve(cwd, "app/components")
    )
  })

  it("respects an explicit srcDir in nuxt.config.ts over any default", async () => {
    await writeFile(
      path.resolve(cwd, "nuxt.config.ts"),
      `export default defineNuxtConfig({ srcDir: "source/" })\n`
    )
    const config = await resolveConfigPaths(cwd, nuxtConfig(cwd))
    expect(config.resolvedPaths.components).toBe(
      path.resolve(cwd, "source/components")
    )
  })

  it("resolves under app/ when nuxt.config.ts opts into compatibilityVersion 4", async () => {
    await writeFile(
      path.resolve(cwd, "nuxt.config.ts"),
      `export default defineNuxtConfig({ future: { compatibilityVersion: 4 } })\n`
    )
    const config = await resolveConfigPaths(cwd, nuxtConfig(cwd))
    expect(config.resolvedPaths.components).toBe(
      path.resolve(cwd, "app/components")
    )
  })

  it("resolves at the project root for a plain Nuxt 3 project (no app/, no srcDir, no v4 hint)", async () => {
    await writeFile(
      path.resolve(cwd, "package.json"),
      JSON.stringify({ dependencies: { nuxt: "^3.14.0" } })
    )
    const config = await resolveConfigPaths(cwd, nuxtConfig(cwd))
    expect(config.resolvedPaths.components).toBe(
      path.resolve(cwd, "components")
    )
  })

  it("still resolves under src/ for a Vite Vue project, unaffected by Nuxt detection", async () => {
    const config = await resolveConfigPaths(
      cwd,
      rawConfigSchema.parse({
        style: "default",
        framework: "vue",
        bundler: "vite",
        typescript: true,
        tailwind: {
          config: "tailwind.config.ts",
          css: "src/style.css",
          baseColor: "neutral",
          cssVariables: true,
          prefix: "",
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          composables: "@/composables",
        },
      })
    )
    expect(config.resolvedPaths.components).toBe(
      path.resolve(cwd, "src/components")
    )
  })
})

describe("detectNuxtBaseDir", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-nuxt-base-dir-"))
  })

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true })
  })

  it("ignores a commented-out srcDir instead of treating it as live config", async () => {
    await writeFile(
      path.resolve(cwd, "nuxt.config.ts"),
      `export default defineNuxtConfig({\n  // srcDir: "custom-source",\n})\n`
    )
    expect(await detectNuxtBaseDir(cwd)).toBeUndefined()
  })

  it("ignores a block-commented srcDir too", async () => {
    await writeFile(
      path.resolve(cwd, "nuxt.config.ts"),
      `export default defineNuxtConfig({\n  /* srcDir: "custom-source", */\n})\n`
    )
    expect(await detectNuxtBaseDir(cwd)).toBeUndefined()
  })

  it("resolves the installed Nuxt major from node_modules when the declared specifier has no version (pnpm catalog, workspace, latest, …)", async () => {
    await writeFile(
      path.resolve(cwd, "package.json"),
      JSON.stringify({ dependencies: { nuxt: "catalog:" } })
    )
    await mkdir(path.resolve(cwd, "node_modules/nuxt"), { recursive: true })
    await writeFile(
      path.resolve(cwd, "node_modules/nuxt/package.json"),
      JSON.stringify({ name: "nuxt", version: "4.5.0" })
    )
    expect(await detectNuxtBaseDir(cwd)).toBe("app")
  })
})
