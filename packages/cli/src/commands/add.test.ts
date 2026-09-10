import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { createServer, type Server } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"

import type { RegistryItem } from "../schema/index.js"
import { rawConfigSchema, type Framework } from "../utils/get-config.js"
import { add } from "./add.js"

function button(framework: Framework): RegistryItem {
  const root = framework === "vue" ? "~~" : "@"
  return {
    name: "button",
    type: "registry:ui",
    dependencies: ["class-variance-authority"],
    files: [
      {
        path: `registry/bases/newt/ui/${framework === "vue" ? "button/Button.vue" : "button.tsx"}`,
        type: "registry:ui",
        content: `import { Icon } from "${root}/registry/bases/newt/ui/icon"`,
      },
    ],
  }
}

describe("add installation pipeline", () => {
  let cwd: string
  let server: Server
  let registry: string
  let requests: string[]
  let items: Map<string, RegistryItem>

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-add-"))
    requests = []
    items = new Map()
    server = createServer((request, response) => {
      const url = request.url ?? ""
      requests.push(url)
      const item = items.get(url)
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

  function publish(item: RegistryItem) {
    items.set(`/styles/default/${item.name}.json`, item)
  }

  async function configure(framework: Framework, major = 4) {
    const config = rawConfigSchema.parse({
      framework,
      tailwind: { css: "styles.css" },
      aliases: { components: "@/components", utils: "@/lib/utils" },
    })
    await writeFile(path.join(cwd, "components.json"), JSON.stringify(config))
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({ dependencies: { tailwindcss: `^${major}.0.0` } })
    )
    publish(button(framework))
  }

  function run(options: { overwrite?: boolean; path?: string } = {}) {
    return add({
      cwd,
      registry,
      components: ["button"],
      yes: true,
      overwrite: false,
      all: false,
      skipInstall: true,
      ...options,
    })
  }

  it("fails before fetching a registry when configuration is missing", async () => {
    await expect(run()).rejects.toThrow("Configuration is missing")
    expect(requests).toEqual([])
    expect(await readdir(cwd)).toEqual([])
  })

  it.each(["react", "vue"] as const)(
    "installs %s sources at --path with rewritten imports and no dependency install",
    async (framework) => {
      await configure(framework)
      const manifest = await readFile(path.join(cwd, "package.json"), "utf8")
      await run({ path: "custom-ui" })
      const filename = framework === "vue" ? "button/Button.vue" : "button.tsx"
      expect(
        await readFile(path.join(cwd, "custom-ui", filename), "utf8")
      ).toBe('import { Icon } from "@/components/ui/icon"')
      expect(await readFile(path.join(cwd, "package.json"), "utf8")).toBe(
        manifest
      )
      expect((await readdir(cwd)).toSorted()).toEqual([
        "components.json",
        "custom-ui",
        "package.json",
      ])
    }
  )

  it("preserves existing files with --yes and replaces them only with --overwrite", async () => {
    await configure("react")
    await run()
    const target = path.join(cwd, "components/ui/button.tsx")
    await writeFile(target, "user customization")
    await run()
    expect(await readFile(target, "utf8")).toBe("user customization")
    await run({ overwrite: true })
    expect(await readFile(target, "utf8")).toBe(
      'import { Icon } from "@/components/ui/icon"'
    )
  })

  it("honors an explicit registry target ahead of --path", async () => {
    await configure("react")
    publish({
      name: "button",
      type: "registry:file",
      files: [
        {
          path: "config.ts",
          type: "registry:file",
          target: "settings/config.ts",
          content: "export default {}",
        },
      ],
    })
    await run({ path: "custom-ui" })
    expect(await readFile(path.join(cwd, "settings/config.ts"), "utf8")).toBe(
      "export default {}"
    )
  })

  it.each([3, 4])(
    "appends Tailwind %i styles once across repeated installs",
    async (major) => {
      await configure("react", major)
      const cssPath = path.join(cwd, "styles.css")
      await writeFile(cssPath, "/* existing styles */\n")
      publish({
        ...button("react"),
        cssVars: {
          dark: { "newt-brand": "#5865f2" },
          theme: { "color-newt-brand": "var(--newt-brand)" },
        },
      })
      await run()
      const once = await readFile(cssPath, "utf8")
      expect(once).toContain("/* existing styles */")
      expect(once).toContain("--newt-brand: #5865f2")
      expect(once.includes("@theme")).toBe(major === 4)
      await run()
      expect(await readFile(cssPath, "utf8")).toBe(once)
    }
  )

  it("installs registry dependencies before their consumer", async () => {
    await configure("react")
    publish({ ...button("react"), registryDependencies: ["icon"] })
    publish({
      name: "icon",
      type: "registry:ui",
      files: [
        {
          path: "registry/bases/newt/ui/icon.tsx",
          type: "registry:ui",
          content: "export const Icon = () => null",
        },
      ],
    })
    await run()
    expect(requests).toEqual([
      "/styles/default/button.json",
      "/styles/default/icon.json",
    ])
    expect(
      await readFile(path.join(cwd, "components/ui/icon.tsx"), "utf8")
    ).toBe("export const Icon = () => null")
    expect(
      await readFile(path.join(cwd, "components/ui/button.tsx"), "utf8")
    ).toBe('import { Icon } from "@/components/ui/icon"')
  })
})
