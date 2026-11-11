import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"

import {
  findTailwindEntry,
  renderItemCss,
  resolveDarkSelector,
  tailwindV3DarkMode,
} from "./tailwind.js"

const theme = {
  cssVars: {
    theme: { "--color-newt-brand": "var(--newt-brand)" },
    dark: {
      "newt-bg-base": "#1e1f22",
      "newt-brand": "#5865f2",
      "newt-radius-md": "8px",
    },
    light: { "newt-bg-base": "#e3e5e8" },
  },
}

/** Every top-level `<selector> {` the rendered stylesheet opens. */
function selectors(css: string): string[] {
  return [...css.matchAll(/^(\S[^{\n]*?)\s*\{$/gm)].map(
    (match) => match[1] ?? ""
  )
}

describe("renderItemCss", () => {
  it("writes one complete light :root and only the differing values under .dark", () => {
    const css = renderItemCss(theme, 4)

    expect(selectors(css)).toEqual(["@theme", ":root", ".dark"])
    const root = css.slice(css.indexOf(":root"), css.indexOf(".dark"))
    expect(root).toContain("--newt-bg-base: #e3e5e8;")
    expect(root).toContain("--newt-brand: #5865f2;")
    expect(root).toContain("--newt-radius-md: 8px;")
    const dark = css.slice(css.indexOf(".dark"))
    expect(dark).toContain("--newt-bg-base: #1e1f22;")
    expect(dark).not.toContain("--newt-brand")
  })

  it("puts the dark values under [data-theme=dark] when asked", () => {
    const css = renderItemCss(theme, 4, "data-theme")

    expect(selectors(css)).toEqual(["@theme", ":root", '[data-theme="dark"]'])
  })

  it("nests the dark :root inside a prefers-color-scheme query for media", () => {
    const css = renderItemCss(theme, 3, "media")

    expect(css).toContain(
      "@media (prefers-color-scheme: dark) {\n  :root {\n    --newt-bg-base: #1e1f22;\n  }\n}"
    )
  })

  it("leaves the @theme block out on Tailwind v3", () => {
    expect(renderItemCss(theme, 3)).not.toContain("@theme")
  })

  it("writes a dark-only item to :root alone", () => {
    const css = renderItemCss({ cssVars: { dark: theme.cssVars.dark } }, 4)

    expect(selectors(css)).toEqual([":root"])
  })
})

describe("resolveDarkSelector", () => {
  it.each([
    [undefined, ".dark"],
    ["class", ".dark"],
    ["data-theme", '[data-theme="dark"]'],
    ["media", "@media (prefers-color-scheme: dark)"],
    [".theme-night", ".theme-night"],
  ])("maps %s to %s", (value, expected) => {
    expect(resolveDarkSelector(value)).toBe(expected)
  })
})

describe("tailwindV3DarkMode", () => {
  it.each([
    ["class", '["class"]'],
    ["media", '"media"'],
    ["data-theme", '["selector","[data-theme=\\"dark\\"]"]'],
  ])("maps %s to %s", (value, expected) => {
    expect(tailwindV3DarkMode(value)).toBe(expected)
  })
})

describe("findTailwindEntry", () => {
  let cwd: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-tailwind-"))
  })

  afterEach(async () => {
    await rm(cwd, { recursive: true, force: true })
  })

  it("finds the stylesheet that already imports Tailwind", async () => {
    await mkdir(path.join(cwd, "app/assets/css"), { recursive: true })
    const main = path.join(cwd, "app/assets/css/main.css")
    await writeFile(main, '@import "tailwindcss";\n')

    const entry = await findTailwindEntry(
      cwd,
      path.join(cwd, "app/assets/css/newt.css")
    )

    expect(entry).toBe(main)
  })

  it("ignores the target stylesheet and dependencies", async () => {
    await mkdir(path.join(cwd, "node_modules/pkg"), { recursive: true })
    await writeFile(
      path.join(cwd, "node_modules/pkg/index.css"),
      '@import "tailwindcss";\n'
    )
    const target = path.join(cwd, "global.css")
    await writeFile(target, "@tailwind base;\n")

    expect(await findTailwindEntry(cwd, target)).toBeUndefined()
  })
})
