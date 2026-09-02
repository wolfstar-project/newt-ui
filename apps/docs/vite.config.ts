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
export default defineConfig({
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
