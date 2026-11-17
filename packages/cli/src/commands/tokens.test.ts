import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises"
import { createServer, type Server } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"

import type { RegistryItem } from "../schema/index.js"
import { rawConfigSchema } from "../utils/get-config.js"
import { readStylesheets } from "../utils/updaters/update-theme-names.js"
import { tokens } from "./tokens.js"

const theme: RegistryItem = {
  name: "theme-newt",
  type: "registry:theme",
  cssVars: {
    theme: {
      "--color-newt-brand": "var(--newt-brand)",
      "--shadow-elevation-high": "var(--newt-shadow-elevation-high)",
      "--transition-duration-fast": "var(--newt-duration-fast)",
    },
    dark: {
      "newt-brand": "#5865f2",
      "newt-shadow-elevation-high": "0 8px 16px rgba(0,0,0,0.24)",
      "newt-duration-fast": "100ms",
    },
  },
  tailwind: {
    config: {
      theme: {
        extend: {
          colors: { newt: { brand: "var(--newt-brand)" } },
          boxShadow: { "elevation-high": "var(--newt-shadow-elevation-high)" },
          transitionDuration: { fast: "var(--newt-duration-fast)" },
        },
      },
    },
  },
}

const popout: RegistryItem = {
  name: "popout",
  type: "registry:ui",
  files: [
    {
      path: "registry/bases/newt/ui/popout.tsx",
      type: "registry:ui",
      content: `export const Popout = () => <div className="shadow-elevation-high" />`,
    },
  ],
}

/* An `init` from before the motion and shadow names: colours only. */
const olderInit = `@import "tailwindcss";

@theme {
  --color-newt-brand: var(--newt-brand);
}

:root {
  --newt-brand: #5865f2;
}
`

describe("tokens", () => {
  let cwd: string
  let server: Server
  let registry: string

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-tokens-"))
    const items = new Map(
      [theme, popout].map((item) => [`/styles/default/${item.name}.json`, item])
    )
    server = createServer((request, response) => {
      const item = items.get(request.url ?? "")
      response.writeHead(item ? 200 : 404, {
        "Content-Type": "application/json",
      })
      response.end(JSON.stringify(item ?? { error: "Not found" }))
    })
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject)
      server.listen(0, "127.0.0.1", () => resolve())
    })
    const address = z.object({ port: z.number() }).parse(server.address())
    registry = `http://127.0.0.1:${address.port}`
  })

  afterEach(async () => {
    server.closeAllConnections()
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
    await rm(cwd, { recursive: true, force: true })
  })

  async function project(major: 3 | 4, css: string) {
    const config = rawConfigSchema.parse({
      framework: "react",
      tailwind: { css: "styles.css" },
      aliases: { components: "@/components", utils: "@/lib/utils" },
    })
    await writeFile(path.join(cwd, "components.json"), JSON.stringify(config))
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ dependencies: { tailwindcss: `^${major}.0.0` } })
    )
    await writeFile(path.join(cwd, "styles.css"), css)
  }

  const run = (options: { components?: string[]; dryRun?: boolean } = {}) =>
    tokens({ cwd, registry, components: [], dryRun: false, ...options })
  const stylesheet = () => readFile(path.join(cwd, "styles.css"), "utf8")

  it("appends only the missing names on Tailwind v4, and nothing on a second run", async () => {
    await project(4, olderInit)

    await run()
    const once = await stylesheet()
    expect(once.startsWith(olderInit)).toBe(true)
    const added = once.slice(olderInit.length)
    expect(added).toContain(
      "--shadow-elevation-high: var(--newt-shadow-elevation-high);"
    )
    expect(added).toContain(
      "--transition-duration-fast: var(--newt-duration-fast);"
    )
    expect(added).toContain("--newt-duration-fast: 100ms;")
    expect(added).not.toContain("--color-newt-brand")
    expect(added).not.toContain("--newt-brand:")

    await run()
    expect(await stylesheet()).toBe(once)
  })

  it("limits the names to what the named components use", async () => {
    await project(4, olderInit)

    await run({ components: ["popout"] })
    const added = (await stylesheet()).slice(olderInit.length)
    expect(added).toContain("--shadow-elevation-high")
    expect(added).not.toContain("--transition-duration-fast")
  })

  it("writes only the raw variables on Tailwind v3", async () => {
    await project(3, ":root {\n  --newt-brand: #5865f2;\n}\n")

    await run()
    const css = await stylesheet()
    expect(css).not.toContain("@theme")
    expect(css).toContain("--newt-shadow-elevation-high:")
    expect(css).toContain("--newt-duration-fast: 100ms;")
  })

  it("writes nothing with --dry-run", async () => {
    await project(4, olderInit)

    await run({ dryRun: true })
    expect(await stylesheet()).toBe(olderInit)
  })

  it("counts names declared in a stylesheet the entry imports", async () => {
    await project(4, `@import "tailwindcss";\n@import "./newt.css";\n`)
    await writeFile(path.join(cwd, "newt.css"), olderInit)

    expect(await readStylesheets(path.join(cwd, "styles.css"))).toContain(
      "--color-newt-brand: var(--newt-brand);"
    )
    await run()
    const added = await stylesheet()
    expect(added).toContain("--shadow-elevation-high")
    expect(added).not.toContain("--color-newt-brand")
  })

  it("fails when the registry does not serve the theme", async () => {
    await project(4, olderInit)

    await expect(
      tokens({
        cwd,
        registry: `${registry}/elsewhere`,
        components: [],
        dryRun: false,
      })
    ).rejects.toThrow("did not serve the theme")
  })
})
