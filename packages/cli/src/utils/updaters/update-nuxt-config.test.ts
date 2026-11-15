import vm from "node:vm"

import { describe, expect, it } from "vitest"

import {
  barrelIgnorePattern,
  componentsOption,
  ignoreBarrels,
} from "./update-nuxt-config.js"

describe("barrelIgnorePattern", () => {
  it("names the barrels of the default ui directory", () => {
    expect(
      barrelIgnorePattern({
        componentsDir: "/project/app/components",
        uiDir: "/project/app/components/ui",
        typescript: true,
      })
    ).toBe("ui/**/index.ts")
  })

  it("follows a ui directory configured deeper inside components", () => {
    expect(
      barrelIgnorePattern({
        componentsDir: "/project/app/components",
        uiDir: "/project/app/components/newt/ui",
        typescript: true,
      })
    ).toBe("newt/ui/**/index.ts")
  })

  it("covers the whole directory when ui is the components directory", () => {
    expect(
      barrelIgnorePattern({
        componentsDir: "/project/app/components",
        uiDir: "/project/app/components",
        typescript: true,
      })
    ).toBe("**/index.ts")
  })

  it("names index.js for a project without TypeScript", () => {
    expect(
      barrelIgnorePattern({
        componentsDir: "/project/components",
        uiDir: "/project/components/ui",
        typescript: false,
      })
    ).toBe("ui/**/index.js")
  })

  it("has nothing to ignore when Nuxt does not scan the ui directory", () => {
    expect(
      barrelIgnorePattern({
        componentsDir: "/project/app/components",
        uiDir: "/project/app/newt/ui",
        typescript: true,
      })
    ).toBeUndefined()
  })
})

interface LoadedConfig {
  components: { ignore?: string[] }[]
}

/** Run an edited config the way Nuxt would, and return what it exports. */
function loadConfig(source: string): LoadedConfig {
  return vm.runInNewContext(source.replace("export default", "result ="), {
    defineNuxtConfig: (config: LoadedConfig) => config,
    result: undefined,
  })
}

const CONFIG = `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
})
`

describe("ignoreBarrels", () => {
  it("adds the components option and keeps every other option", () => {
    expect(ignoreBarrels(CONFIG, "ui/**/index.ts")).toEqual({
      _tag: "Edited",
      source: `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  components: [
    { path: "~/components/islands", island: true },
    { path: "~/components/global", global: true },
    { path: "~/components", ignore: ["ui/**/index.ts"] },
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
})
`,
    })
  })

  it("indents the option like the options beside it", () => {
    const edit = ignoreBarrels(
      'export default defineNuxtConfig({\n\tssr: false,\n\tcss: ["~/a.css"],\n})\n',
      "ui/**/index.ts"
    )

    expect(edit).toEqual({
      _tag: "Edited",
      source: [
        "export default defineNuxtConfig({",
        "\tcomponents: [",
        '\t\t{ path: "~/components/islands", island: true },',
        '\t\t{ path: "~/components/global", global: true },',
        '\t\t{ path: "~/components", ignore: ["ui/**/index.ts"] },',
        "\t],",
        "\tssr: false,",
        '\tcss: ["~/a.css"],',
        "})",
        "",
      ].join("\n"),
    })
  })

  it("writes single quotes into a config that uses them", () => {
    // The shape `create-nuxt` writes.
    const source = `export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
`
    expect(ignoreBarrels(source, "ui/**/index.ts")).toEqual({
      _tag: "Edited",
      source: `export default defineNuxtConfig({
  components: [
    { path: '~/components/islands', island: true },
    { path: '~/components/global', global: true },
    { path: '~/components', ignore: ['ui/**/index.ts'] },
  ],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
`,
    })
  })

  it.each([
    ["single", "'", "customer's/**/index.ts"],
    ["double", '"', 'say "hi"/**/index.ts'],
  ])(
    "writes a pattern with a quote that a %s-quoted config can load",
    (_label, quote, ignore) => {
      const source = `export default defineNuxtConfig({\n  ssr: ${quote}x${quote},\n})\n`
      const edit = ignoreBarrels(source, ignore)
      if (edit._tag !== "Edited") throw new Error(`not edited: ${edit._tag}`)

      expect(loadConfig(edit.source).components[2]?.ignore).toEqual([ignore])
      expect(ignoreBarrels(edit.source, ignore)).toEqual({
        _tag: "AlreadyIgnored",
      })
    }
  )

  it("keeps the line endings of the file", () => {
    const edit = ignoreBarrels(
      CONFIG.replaceAll("\n", "\r\n"),
      "ui/**/index.ts"
    )

    expect(edit._tag).toBe("Edited")
    expect(edit._tag === "Edited" && /[^\r]\n/.test(edit.source)).toBe(false)
  })

  it("does nothing the second time", () => {
    const first = ignoreBarrels(CONFIG, "ui/**/index.ts")
    const source = first._tag === "Edited" ? first.source : CONFIG

    expect(ignoreBarrels(source, "ui/**/index.ts")).toEqual({
      _tag: "AlreadyIgnored",
    })
  })

  it("leaves a config that already sets components to its owner", () => {
    const source = `export default defineNuxtConfig({
  components: [{ path: "~/components", pathPrefix: false }],
})
`
    expect(ignoreBarrels(source, "ui/**/index.ts")).toEqual({
      _tag: "Manual",
      reason: "components-option",
    })
  })

  it("is not stopped by a components option that is commented out", () => {
    const source = `export default defineNuxtConfig({
  // components: false,
  ssr: true,
})
`
    expect(ignoreBarrels(source, "ui/**/index.ts")._tag).toBe("Edited")
  })

  it("writes into the live call when an older one is commented out", () => {
    const source = `/* export default defineNuxtConfig({
  ssr: false,
}) */
export default defineNuxtConfig({
  ssr: true,
})
`
    expect(ignoreBarrels(source, "ui/**/index.ts")).toEqual({
      _tag: "Edited",
      source: `/* export default defineNuxtConfig({
  ssr: false,
}) */
export default defineNuxtConfig({
  components: [
    { path: "~/components/islands", island: true },
    { path: "~/components/global", global: true },
    { path: "~/components", ignore: ["ui/**/index.ts"] },
  ],
  ssr: true,
})
`,
    })
  })

  it("sees a components option that sits between two globs", () => {
    // Read as comments, "/*.spec.ts … **/" would swallow the option between.
    const source = `export default defineNuxtConfig({
  ignore: ["**/*.spec.ts"],
  components: [{ path: "~/components", ignore: ["**/*.stories.ts"] }],
})
`
    expect(ignoreBarrels(source, "ui/**/index.ts")).toEqual({
      _tag: "Manual",
      reason: "components-option",
    })
  })

  it.each([
    ["a spread after the options", "  ssr: true,\n  ...sharedConfig,\n"],
    ["a spread before the options", "  ...sharedConfig,\n  ssr: true,\n"],
    ["a conditional spread", "  ...(isDev ? devConfig : {}),\n"],
  ])("leaves a config with %s to its owner", (_label, options) => {
    // The spread object may set components and replace the inserted option.
    const source = `export default defineNuxtConfig({\n${options}})\n`

    expect(ignoreBarrels(source, "ui/**/index.ts")).toEqual({
      _tag: "Manual",
      reason: "spread",
    })
  })

  it("edits a config whose only spreads sit inside an option", () => {
    const source = `export default defineNuxtConfig({
  modules: [...baseModules, "@nuxt/ui"],
  vite: { ...viteConfig },
  app: { head: { title: "a ...b" } },
})
`
    expect(ignoreBarrels(source, "ui/**/index.ts")._tag).toBe("Edited")
  })

  it.each([
    ["no defineNuxtConfig call", "export default {}\n"],
    [
      "a config on one line",
      "export default defineNuxtConfig({ ssr: false })\n",
    ],
    [
      "two defineNuxtConfig calls",
      "const base = defineNuxtConfig({\n  ssr: false,\n})\nexport default defineNuxtConfig({\n  extends: [base],\n})\n",
    ],
  ])("does not guess where to write in %s", (_label, source) => {
    expect(ignoreBarrels(source, "ui/**/index.ts")).toEqual({
      _tag: "Manual",
      reason: "config-shape",
    })
  })
})

describe("componentsOption", () => {
  it("keeps the directories Nuxt scans by default", () => {
    expect(componentsOption("newt/ui/**/index.ts")).toBe(
      `components: [
  { path: "~/components/islands", island: true },
  { path: "~/components/global", global: true },
  { path: "~/components", ignore: ["newt/ui/**/index.ts"] },
]`
    )
  })
})
