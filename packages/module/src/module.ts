import { join } from "node:path"

import { addComponentsDir, createResolver, defineNuxtModule } from "@nuxt/kit"
import type { NuxtModule } from "@nuxt/schema"

export interface ModuleOptions {
  /**
   * Prefix for the auto-imported components, e.g. `"Newt"` turns
   * `components/ui/button/Button.vue` into `<NewtButton />`.
   * Defaults to no prefix.
   */
  prefix?: string
  /**
   * Directory holding your components, relative to the Nuxt `srcDir`.
   * The module registers `<componentDir>/ui/**`. Defaults to `"components"`.
   */
  componentDir?: string
  /**
   * Inject the `--newt-*` design tokens stylesheet. Set to `false` if you
   * already ship the tokens through your own CSS entry. Defaults to `true`.
   */
  css?: boolean
}

export const DEFAULT_COMPONENT_DIR = "components"

// Annotated so the emitted declaration names `NuxtModule` instead of inlining
// a type from @nuxt/schema's internals.
const newtModule: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@newtui/nuxt",
    configKey: "newt",
    compatibility: {
      nuxt: ">=4.0.0",
    },
  },
  defaults: {
    prefix: "",
    componentDir: DEFAULT_COMPONENT_DIR,
    css: true,
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    const componentDir = options.componentDir ?? DEFAULT_COMPONENT_DIR

    // `components/ui/button/Button.vue` -> `<Button />` (or `<NewtButton />`).
    // Prepended, because Nuxt gives a file to the first directory that scans
    // it. Behind the default `components` directory this one registers
    // nothing: every file is already `<UiButton />`, and each `index.ts`
    // barrel is a duplicate of its component (NUXT_B3011).
    addComponentsDir(
      {
        path: join(nuxt.options.srcDir, componentDir, "ui"),
        prefix: options.prefix ?? "",
        pathPrefix: false,
        extensions: ["vue"],
        global: false,
      },
      { prepend: true }
    )

    if (options.css !== false) {
      const tokens = resolver.resolve("./runtime/tokens.css")
      if (!nuxt.options.css.includes(tokens)) {
        nuxt.options.css.unshift(tokens)
      }
    }

    nuxt.options.build.transpile.push(resolver.resolve("./runtime"))
  },
})

export default newtModule
