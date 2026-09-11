import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

import { unified } from "@astrojs/markdown-remark"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import vue from "@astrojs/vue"
import { lotus } from "@prosefly/astro-theme-lotus"
import AstroPWA from "@vite-pwa/astro"
import expressiveCode from "astro-expressive-code"
import astroTakumi from "astro-takumi"
import { defineConfig } from "astro/config"

import { buildDocsNav } from "./src/lib/lotus-nav"
import { renderOgCard } from "./src/lib/og-card"
import { SITE } from "./src/lib/site"

const here = (relative: string) =>
  fileURLToPath(new URL(relative, import.meta.url))

/*
 * Takumi has no system fonts: every family it draws with has to be handed to
 * it as bytes. Resolved through `require.resolve` rather than a path into
 * `node_modules`, which pnpm does not lay out flat.
 */
const require = createRequire(import.meta.url)
const interFont = (weight: 400 | 700) =>
  readFileSync(
    require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`)
  )

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
    lotus({
      name: SITE.name,
      description: SITE.tagline,
      docsBase: "/docs",
      llms: false,
      siteNav: [{ label: "Docs", href: "/docs" }],
      docsNav: buildDocsNav(),
      /*
       * The site stylesheet, inlined into the sheet the theme generates rather
       * than imported by a layout: that is the only place a second
       * `@import "tailwindcss"` can be avoided, and it is where the theme's own
       * `@source` of this app's `src` already lives.
       *
       * The script beside it is the pre-paint pass the old `Base.astro` ran:
       * the framework switch is a `data-framework` attribute on `<html>`, and
       * `BaseLayout` writes only `lang`, `dir` and its own theme attributes
       * there, so a route cannot put it on the element — it has to be set
       * before the body is parsed instead, or the reader sees both frameworks'
       * code blocks for a frame.
       */
      head: [
        { tag: "style", src: "./src/styles/lotus.css" },
        {
          tag: "script",
          content:
            'try{var f=localStorage.getItem("newt-ui:framework");' +
            'document.documentElement.dataset.framework=' +
            'f==="vue"||f==="react"?f:"react";' +
            'var t=localStorage.getItem("newt-ui:theme");' +
            'if(t==="light"||t==="dark"){' +
            'document.documentElement.dataset.newtTheme=t;' +
            'document.documentElement.style.colorScheme=t}}catch(e){}',
        },
      ],
      search: {
        provider: "pagefind",
        excludeSelectors: [
          ".expressive-code",
          ".demo-frame",
          ".tabs-list",
          ".copy-page",
        ],
      },
      markdown: {
        /*
         * Expressive Code stays the site's own: the theme passes its options
         * inline with plugin functions in them, and the `<Code>` component
         * four MDX components use refuses to render when the config is not
         * JSON-serialisable.
         */
        expressiveCode: false,
        /*
         * Seventeen shell fences across seven pages — nine of them in the CLI
         * reference — are a single deliberate command, not a choose-your-own
         * package manager. Left on, the theme rewrites each into a four-tab
         * widget that the site already has its own `<PmTabs>` for.
         */
        packageManagerTabs: false,
        /*
         * Nothing in the content uses `:::note`, and the plugin's only other
         * effect is to pull `remark-directive` into the parser, which gives
         * every stray `:word` in prose a second meaning. Off, `:name` is text.
         */
        calloutDirectives: false,
      },
    }),
    react(),
    vue(),
    /*
     * The article is the indexed body, and these are the parts of it that are
     * not prose: rendered component source, the live demos' own UI text, the
     * tab labels and the copy-page menu. Left in, a search for "avatar" answers
     * with `className={cn(...)}` from a code block rather than with the
     * sentence describing the component.
     */
    sitemap(),
    /*
     * One Open Graph image per page, rendered at build time from the page's
     * own title and description. A link to a component page unfurls as that
     * component's name rather than as the same generic card every time.
     */
    astroTakumi({
      options: {
        fonts: [interFont(400), interFont(700)],
        format: "webp",
        quality: 90,
        fontFamilies: ["Inter"],
      },
      render: async ({ pathname, title, description }) =>
        renderOgCard({ pathname, title, description }),
    }),
    /*
     * Installable, and readable on a train. The registry JSON under `r/**` is
     * copied in after this build step, so it is never precached — what the
     * service worker holds is the documentation itself, which is the part
     * somebody offline wants.
     */
    AstroPWA({
      registerType: "autoUpdate",
      pwaAssets: { config: true, overrideManifestIcons: true },
      manifest: {
        name: "newt/ui",
        short_name: "newt/ui",
        description: SITE.tagline,
        /* The dark surface the site opens on, so the splash is not a flash. */
        background_color: "#1e1f22",
        theme_color: "#5865f2",
        display: "standalone",
        start_url: "/",
        scope: "/",
        categories: ["developer", "productivity"],
      },
      workbox: {
        /*
         * The shell is precached; the pages are not. Every page of this site
         * together is 11MB of HTML, and installing that on somebody who came
         * to read one component page would be a tax they never asked for.
         * What they do read is kept by the runtime rule below, so a reader who
         * browses ends up with what they browsed, offline, and nobody pays for
         * the other hundred pages.
         */
        globPatterns: [
          "index.html",
          "404.html",
          "**/*.{css,js,svg,png,ico,woff2}",
        ],
        globIgnores: ["pagefind/**", "r/**", "vue/**", "**/*.md"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "newt-pages",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
        /*
         * Explicitly no navigation fallback — and it has to be spelled out,
         * because the integration fills the key in with `/` when it is absent.
         * Workbox registers that route before the rule above and matches in
         * order, so any fallback answers *every* navigation with the home page,
         * including the pages a reader had already opened. Without it, a page
         * that was read comes back from the cache and one that was not gets the
         * browser's own offline error, which at least says what happened.
         */
        navigateFallback: undefined,
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 3_000_000,
      },
      /*
       * `directoryAndTrailingSlashHandler` is off on purpose: it routes every
       * navigation through the precache, and the pages are deliberately not in
       * there, so each one would answer with the shell instead of itself. The
       * runtime rule above owns navigations instead.
       */
    }),
  ],
  markdown: {
    /*
     * An empty `unified()` processor, and it has to be there.
     *
     * Expressive Code configures itself against whatever processor exists at
     * its own setup hook: a `unified()` gets `rehypeExpressiveCode` pushed
     * into its `rehypePlugins`, a `satteri()` gets a hast plugin pushed into
     * its `hastPlugins`. Lotus then replaces the processor through
     * `@prosefly/astro-components`, which reads the plugin lists off a
     * `unified()` and carries them over — but throws a `satteri()` away whole,
     * Expressive Code's plugin with it.
     *
     * Left at Astro's default (`satteri`), every fenced block in the 107 MDX
     * files comes out as a bare `<pre><code class="language-bash"
     * metastring="title=…">`: no highlighting, no frame, no copy button, and
     * the meta string leaked into an attribute. Naming `unified()` here is
     * what keeps them.
     *
     * `## Heading {#id}` keeps working either way: the theme's
     * `remarkHeadingIds` reads the same syntax `lib/hast-heading-id.ts` used
     * to, only unescaped.
     */
    processor: unified({}),
  },
  vite: {
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
