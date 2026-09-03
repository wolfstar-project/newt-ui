import { fileURLToPath } from "node:url"

import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import vue from "@vitejs/plugin-vue"
import { defineConfig } from "vite"

/*
 * The two registries are checked in under `apps/www` and `apps/vue` and both
 * were written against their own app's `@` alias, so this site has to answer
 * for both at once:
 *
 *   React: `@/lib/utils` + `@/registry/default/ui/*`
 *   Vue:   `@/lib/utils` + `@/lib/registry/default/ui/*`
 *
 * A string alias matches by prefix, so the list is an ARRAY and the entries run
 * longest prefix first: `@/lib/registry` has to be tried before `@/lib/utils`,
 * or the shorter one never gets the chance to be wrong about it.
 */
/*
 * The site is published on its own domain, so it is served from the root and
 * the base is that root: both CLIs fetch their registry from
 * `https://newtui.dev/r` and `https://newtui.dev/vue/r`, which are the paths
 * `scripts/bundle-registry.mjs` writes. Serving this build under a path
 * prefix instead would need `base` set to that prefix, or every asset URL
 * resolves at the wrong origin root.
 */
export default defineConfig({
  base: "/",
  plugins: [react(), vue(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "@/lib/registry",
        replacement: fileURLToPath(
          new URL("../vue/app/lib/registry", import.meta.url)
        ),
      },
      {
        find: "@/lib/utils",
        replacement: fileURLToPath(
          new URL("./src/lib/utils.ts", import.meta.url)
        ),
      },
      {
        find: "@/registry",
        replacement: fileURLToPath(new URL("../www/registry", import.meta.url)),
      },
    ],
  },
})
