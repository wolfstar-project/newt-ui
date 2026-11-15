import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { stripVTControlCharacters } from "node:util"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { getConfig, rawConfigSchema, type Config } from "../get-config.js"
import { logger } from "../logger.js"
import {
  missingThemeNames,
  themeCatalogue,
  themeNamesUsed,
} from "../theme-names.js"
import {
  readProjectTheme,
  readStylesheets,
  reportMissingThemeNames,
} from "./update-theme-names.js"

const theme = themeCatalogue({
  cssVars: {
    theme: { "--shadow-elevation-high": "var(--newt-shadow-elevation-high)" },
    dark: { "newt-shadow-elevation-high": "0 8px 16px rgba(0,0,0,0.24)" },
  },
  tailwind: {
    config: {
      theme: {
        extend: {
          boxShadow: { "elevation-high": "var(--newt-shadow-elevation-high)" },
        },
      },
    },
  },
})

describe("update-theme-names", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-theme-names-"))
  })

  afterEach(async () => {
    vi.restoreAllMocks()
    await rm(cwd, { recursive: true, force: true })
  })

  async function project(major: 3 | 4, css: string): Promise<Config> {
    const raw = rawConfigSchema.parse({
      framework: "react",
      tailwind: { css: "styles.css" },
      aliases: { components: "@/components", utils: "@/lib/utils" },
    })
    await writeFile(path.join(cwd, "components.json"), JSON.stringify(raw))
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ dependencies: { tailwindcss: `^${major}.0.0` } })
    )
    await writeFile(path.join(cwd, "styles.css"), css)
    const config = await getConfig(cwd)
    if (config === null) throw new Error("components.json was not read")
    return config
  }

  it("follows an @import with a bare relative path", async () => {
    await mkdir(path.join(cwd, "tailwindcss"))
    await writeFile(
      path.join(cwd, "styles.css"),
      `@import "tailwindcss";\n@import "newt.css";\n@import url(more.css);\n`
    )
    await writeFile(path.join(cwd, "newt.css"), ":root { --newt-brand: red; }")
    await writeFile(path.join(cwd, "more.css"), ":root { --newt-ease: x; }")

    const css = await readStylesheets(path.join(cwd, "styles.css"))

    expect(css).toContain("--newt-brand: red;")
    expect(css).toContain("--newt-ease: x;")
  })

  it("reads a tailwind.config found in the project, not the process cwd", async () => {
    const config = await project(3, "")
    await writeFile(
      path.join(cwd, "tailwind.config.js"),
      "module.exports = { theme: {} }"
    )

    const read = await readProjectTheme(config)

    expect(read.config).toBe("module.exports = { theme: {} }")
  })

  it("prints only the config entries when the v3 stylesheet lacks nothing", async () => {
    const css = ":root { --newt-shadow-elevation-high: none; }\n"
    const config = await project(3, css)
    const lines: string[] = []
    vi.spyOn(logger, "warn").mockImplementation(() => {})
    vi.spyOn(logger, "log").mockImplementation((line) => lines.push(line))

    const read = { major: 3 as const, css, config: null }
    reportMissingThemeNames(
      missingThemeNames(themeNamesUsed(theme, ["shadow-elevation-high"]), read),
      theme,
      read,
      config
    )

    expect(lines.join("\n")).not.toContain("paste this")
    expect(
      lines.every((line) => stripVTControlCharacters(line).trim().length > 0)
    ).toBe(true)
    expect(lines.join("\n")).toContain('"elevation-high"')
  })
})
