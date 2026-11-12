import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { createServer, type Server } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"

import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { z } from "zod"

import type { Registries } from "../registry/namespaces.js"
import type { RegistryItem } from "../schema/index.js"
import { rawConfigSchema, type Framework } from "../utils/get-config.js"
import { add, importHint } from "./add.js"

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
  /** Third-party payloads, served as written: they need not match our schema. */
  let served: Map<string, unknown>

  beforeEach(async () => {
    cwd = await mkdtemp(path.join(tmpdir(), "newtui-add-"))
    requests = []
    items = new Map()
    served = new Map()
    server = createServer((request, response) => {
      const url = request.url ?? ""
      requests.push(url)
      const item = items.get(url) ?? served.get(url)
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

  async function withRegistries(registries: Registries, major = 4) {
    await configure("react", major)
    const file = path.join(cwd, "components.json")
    const config = rawConfigSchema.parse(
      JSON.parse(await readFile(file, "utf8"))
    )
    await writeFile(file, JSON.stringify({ ...config, registries }))
  }

  function run(
    options: {
      overwrite?: boolean
      path?: string
      components?: string[]
    } = {}
  ) {
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

  it("writes a lib item to the lib directory and appends its stylesheet", async () => {
    await configure("vue")
    publish({
      name: "nuxt-ui-theme",
      type: "registry:lib",
      files: [
        {
          path: "lib/nuxt-ui.ts",
          type: "registry:lib",
          content: "export const newtNuxtUi = {}",
        },
      ],
      css: {
        ":root, .light, .dark": { "--ui-primary": "var(--newt-brand)" },
      },
    })
    await run({ components: ["nuxt-ui-theme"] })
    expect(await readFile(path.join(cwd, "lib/nuxt-ui.ts"), "utf8")).toBe(
      "export const newtNuxtUi = {}"
    )
    const css = await readFile(path.join(cwd, "styles.css"), "utf8")
    expect(css).toContain(":root, .light, .dark {")
    expect(css).toContain("--ui-primary: var(--newt-brand);")
    /* A second run must not append the same rules again. */
    await run({ components: ["nuxt-ui-theme"], overwrite: true })
    expect(await readFile(path.join(cwd, "styles.css"), "utf8")).toBe(css)
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

  describe("third-party registries", () => {
    const card = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: "card",
      type: "registry:item",
      registryDependencies: ["button"],
      files: [
        {
          path: "registry/new-york-v4/ui/card.tsx",
          type: "registry:ui",
          content:
            'import { Button } from "@/registry/new-york-v4/ui/button"\nimport { cn } from "@/lib/utils"',
        },
      ],
    }
    const shadcnButton = {
      name: "button",
      type: "registry:ui",
      files: [
        {
          path: "registry/new-york-v4/ui/button.tsx",
          type: "registry:ui",
          content: "export const Button = () => null",
        },
      ],
    }

    afterEach(() => {
      delete process.env.NEWT_REGISTRY_DIRECTORY_URL
      delete process.env.ACME_TOKEN
    })

    it("installs a namespaced item, its shadcn dependency and the colour bridge", async () => {
      await withRegistries({
        "@acme": `${registry}/acme/{name}.json`,
        "@shadcn": `${registry}/shadcn/{style}/{name}.json`,
      })
      served.set("/acme/card.json", card)
      served.set("/shadcn/new-york-v4/button.json", shadcnButton)

      await run({ components: ["@acme/card"] })

      expect(requests).toEqual([
        "/acme/card.json",
        "/shadcn/new-york-v4/button.json",
      ])
      expect(
        await readFile(path.join(cwd, "components/ui/card.tsx"), "utf8")
      ).toBe(
        'import { Button } from "@/components/ui/button"\nimport { cn } from "@/lib/utils"'
      )
      expect(
        await readFile(path.join(cwd, "components/ui/button.tsx"), "utf8")
      ).toBe("export const Button = () => null")

      const css = await readFile(path.join(cwd, "styles.css"), "utf8")
      expect(css).toContain("@theme inline {")
      expect(css).toContain("--color-primary: var(--newt-brand);")
      await run({ components: ["@acme/card"], overwrite: true })
      expect(await readFile(path.join(cwd, "styles.css"), "utf8")).toBe(css)
    })

    it("leaves the stylesheet alone on Tailwind v3", async () => {
      await withRegistries({ "@acme": `${registry}/acme/{name}.json` }, 3)
      served.set("/acme/card.json", { ...card, registryDependencies: [] })
      await run({ components: ["@acme/card"] })
      await expect(
        readFile(path.join(cwd, "styles.css"), "utf8")
      ).rejects.toThrow()
    })

    it.each([
      ["a map of templates", (url: string) => ({ "@listed": url })],
      [
        "a list of entries",
        (url: string) => [
          { name: "@listed", url, homepage: "https://example.com" },
        ],
      ],
    ])(
      "resolves an unconfigured namespace from a directory that is %s",
      async (_, directory) => {
        await configure("react")
        served.set(
          "/registries.json",
          directory(`${registry}/listed/{name}.json`)
        )
        served.set("/listed/card.json", { ...card, registryDependencies: [] })
        process.env.NEWT_REGISTRY_DIRECTORY_URL = `${registry}/registries.json`
        await run({ components: ["@listed/card"] })
        expect(requests).toEqual(["/registries.json", "/listed/card.json"])
        expect(
          await readFile(path.join(cwd, "components/ui/card.tsx"), "utf8")
        ).toContain("@/components/ui/button")
      }
    )

    it("keeps a component's own directory below components", async () => {
      await withRegistries({ "@acme": `${registry}/acme/{name}.json` })
      served.set("/acme/message.json", {
        name: "message",
        type: "registry:component",
        files: [
          {
            path: "components/acme/message/Message.tsx",
            type: "registry:component",
            content: "export {}",
          },
        ],
      })
      await run({ components: ["@acme/message"] })
      expect(
        await readFile(
          path.join(cwd, "components/acme/message/Message.tsx"),
          "utf8"
        )
      ).toBe("export {}")
    })

    it("names the registry it could not find", async () => {
      await configure("react")
      served.set("/registries.json", {})
      process.env.NEWT_REGISTRY_DIRECTORY_URL = `${registry}/registries.json`
      await expect(run({ components: ["@nowhere/card"] })).rejects.toThrow(
        'Unknown registry "@nowhere"'
      )
    })

    it("sends the headers and params a private registry asks for", async () => {
      await withRegistries({
        "@acme": {
          url: `${registry}/acme/{name}.json`,
          params: { version: "2" },
          headers: { Authorization: "Bearer ${ACME_TOKEN}" },
        },
      })
      served.set("/acme/card.json?version=2", {
        ...card,
        registryDependencies: [],
      })
      await expect(run({ components: ["@acme/card"] })).rejects.toThrow(
        "ACME_TOKEN"
      )
      process.env.ACME_TOKEN = "secret"
      await run({ components: ["@acme/card"] })
      expect(requests).toEqual(["/acme/card.json?version=2"])
    })

    it("never expands ${NAME} in a template that came from a directory", async () => {
      await configure("react")
      process.env.ACME_TOKEN = "secret"
      served.set("/registries.json", {
        "@listed": `${registry}/listed/{name}.json?k=\${ACME_TOKEN}`,
      })
      served.set("/listed/card.json?k=${ACME_TOKEN}", {
        ...card,
        registryDependencies: [],
      })
      process.env.NEWT_REGISTRY_DIRECTORY_URL = `${registry}/registries.json`
      await run({ components: ["@listed/card"] })
      expect(requests.some((url) => url.includes("secret"))).toBe(false)
      expect(requests.at(-1)).toContain("k=")
    })

    it("lets a file without its own type take its item's", async () => {
      await withRegistries({ "@acme": `${registry}/acme/{name}.json` })
      served.set("/acme/card.json", {
        name: "card",
        type: "registry:ui",
        files: [{ path: "registry/acme/card.tsx", content: "export {}" }],
      })
      await run({ components: ["@acme/card"] })
      expect(
        await readFile(path.join(cwd, "components/ui/card.tsx"), "utf8")
      ).toBe("export {}")
    })

    it("writes nothing when a later item carries a refused path", async () => {
      await withRegistries({ "@acme": `${registry}/acme/{name}.json` })
      served.set("/acme/card.json", {
        name: "card",
        type: "registry:ui",
        registryDependencies: ["@acme/bad"],
        files: [
          {
            path: "card.tsx",
            type: "registry:ui",
            content: "export {}",
          },
        ],
      })
      served.set("/acme/bad.json", {
        name: "bad",
        type: "registry:file",
        files: [
          {
            path: "bad.ts",
            type: "registry:file",
            target: "../escape.ts",
            content: "",
          },
        ],
      })
      await expect(run({ components: ["@acme/card"] })).rejects.toThrow(
        "Refusing to write"
      )
      expect(await readdir(cwd)).not.toContain("components")
    })

    it("refuses a file that would land outside the project", async () => {
      await withRegistries({ "@acme": `${registry}/acme/{name}.json` })
      served.set("/acme/card.json", {
        name: "card",
        type: "registry:file",
        files: [
          {
            path: "card.ts",
            type: "registry:file",
            target: "../../outside.ts",
            content: "",
          },
        ],
      })
      await expect(run({ components: ["@acme/card"] })).rejects.toThrow(
        "Refusing to write"
      )
    })
  })
})

describe("importHint", () => {
  const aliases = rawConfigSchema.parse({
    framework: "vue",
    tailwind: { css: "styles.css" },
    aliases: {
      components: "@/components",
      utils: "@/lib/utils",
      lib: "~/lib",
    },
  }).aliases

  it("points a component at the ui alias and a block at components", () => {
    expect(
      importHint({ name: "button", type: "registry:ui", files: ["a"] }, aliases)
    ).toBe('import { ... } from "@/components/ui/button"')
    expect(
      importHint(
        { name: "chat-window", type: "registry:block", files: ["a"] },
        aliases
      )
    ).toBe('import { ... } from "@/components/chat-window"')
  })

  it("names a lib item after its file, under the lib alias", () => {
    expect(
      importHint(
        {
          name: "nuxt-ui-theme",
          type: "registry:lib",
          files: [{ path: "lib/nuxt-ui.ts", type: "registry:lib" }],
        },
        aliases
      )
    ).toBe('import { ... } from "~/lib/nuxt-ui"')
  })

  it("says nothing for an item with no files", () => {
    expect(
      importHint({ name: "theme-newt", type: "registry:theme" }, aliases)
    ).toBeUndefined()
  })
})
