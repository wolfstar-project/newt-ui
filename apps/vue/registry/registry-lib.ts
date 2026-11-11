import { NUXT_UI_SELECTOR, nuxtUiVars } from "./registry-nuxt-ui"
import type { Registry } from "./schema"

export const lib: Registry = [
  {
    name: "utils",
    type: "registry:lib",
    dependencies: ["cn"],
    files: [{ path: "lib/utils.ts", type: "registry:lib" }],
  },
  /*
   * Not a component: a theme for somebody else's. It writes one file, the
   * `ui` object for `app.config.ts`, and appends the `--ui-*` to `--newt-*`
   * mapping to the project's stylesheet. It exists only in this registry,
   * because Nuxt UI is a Vue library.
   */
  {
    name: "nuxt-ui-theme",
    type: "registry:lib",
    title: "Nuxt UI theme",
    description:
      "Makes Nuxt UI's own components follow the newt/ui tokens: an app.config ui object and the --ui-* variable mapping.",
    files: [{ path: "lib/nuxt-ui.ts", type: "registry:lib" }],
    css: { [NUXT_UI_SELECTOR]: nuxtUiVars },
  },
]
