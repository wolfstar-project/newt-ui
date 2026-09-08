import { fileURLToPath } from "node:url"

import { satteri } from "@astrojs/markdown-satteri"
import mdx from "@astrojs/mdx"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import vue from "@astrojs/vue"
import tailwindcss from "@tailwindcss/vite"
import expressiveCode from "astro-expressive-code"
import pagefind from "astro-pagefind"
import { defineConfig } from "astro/config"

import { hastHeadingId } from "./src/lib/hast-heading-id"

const here = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url))

export default defineConfig({
  site: "https://newtui.dev",
  output: "static",
  trailingSlash: "never",
  build: { format: "directory" },
  integrations: [
    /*
     * Expressive Code must run before MDX so fenced blocks in content are
     * rendered with frames, titles and a copy button rather than plain shiki.
     * Its options live in `ec.config.mjs`, which is where the `<Code>`
     * component looks for them.
     */
    expressiveCode(),
    mdx(),
    react(),
    vue(),
    /*
     * The article is the indexed body, and these are the parts of it that are
     * not prose: rendered component source, the live demos' own UI text, the
     * tab labels and the copy-page menu. Left in, a search for "avatar" answers
     * with `className={cn(...)}` from a code block rather than with the
     * sentence describing the component.
     */
    pagefind({
      indexConfig: {
        excludeSelectors: [
          ".expressive-code",
          ".demo-frame",
          ".tabs-list",
          ".copy-page",
        ],
      },
    }),
    sitemap(),
  ],
  markdown: {
    // `## Heading {#id}` keeps the explicit id, so published anchors survive a
    // reworded heading. Astro slugs everything else as usual.
    processor: satteri({ hastPlugins: [hastHeadingId] }),
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      /*
       * Registry source sits outside this app. Vue registry components use
       * Nuxt's root alias (`~~`), while docs modules retain the local
       * `@/lib/registry` compatibility alias.
       */
      alias: [
        {
          find: "~~/registry",
          replacement: here("../vue/registry"),
        },
        {
          find: "@/lib/registry",
          replacement: here("../vue/registry"),
        },
        { find: "@/lib/utils", replacement: here("./src/lib/utils.ts") },
        { find: "@/registry", replacement: here("../www/registry") },
        { find: "@/components", replacement: here("./src/components") },
        { find: "@/layouts", replacement: here("./src/layouts") },
        { find: "@/stores", replacement: here("./src/stores") },
        { find: "@/styles", replacement: here("./src/styles") },
        { find: "@/lib", replacement: here("./src/lib") },
      ],
    },
  },
})
