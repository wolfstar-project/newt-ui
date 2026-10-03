import { defineComponents } from "blume"

/*
 * What the content writes without importing, and the two pieces of Blume's
 * chrome this site replaces.
 *
 * Every `mdx` entry is a name the 109 content files use as a tag. The
 * registry-driven ones (`ComponentPreview`, `Installation`, `Usage`,
 * `TokensNote`) read `apps/www/registry/meta`; the rest are the site's own
 * primitives. `ReactDemo` and `VueDemo` are registered as islands so Blume
 * wires up both renderers — `ComponentPreview` mounts them itself, and nothing
 * else about a `.vue` file would tell Blume the site needs Vue.
 *
 * Two layout slots: `Search`, because the header is where the React/Vue switch
 * has always lived and the search trigger is the one slot in it; and `Footer`,
 * which is where the trademark disclaimer goes.
 *
 * Blume reads this file statically, so every entry is a path string or an
 * object literal — never a value computed here.
 */
export default defineComponents({
  mdx: {
    ComponentIndex: "./src/components/mdx/ComponentIndex.astro",
    ComponentPreview: "./src/components/mdx/ComponentPreview.astro",
    FrameworkGrid: "./src/components/mdx/FrameworkGrid.astro",
    Installation: "./src/components/mdx/Installation.astro",
    PathTabs: "./src/components/mdx/PathTabs.astro",
    PmTabs: "./src/components/mdx/PmTabs.astro",
    PropsTable: "./src/components/mdx/PropsTable.astro",
    TokenReference: "./src/components/mdx/TokenReference.astro",
    TokensNote: "./src/components/mdx/TokensNote.astro",
    Usage: "./src/components/mdx/Usage.astro",
    ReactDemo: {
      component: "./src/components/demo/ReactDemo.tsx",
      client: "only",
    },
    VueDemo: { component: "./src/components/demo/VueDemo.vue", client: "only" },
  },
  layout: {
    Footer: "./src/components/layout/Footer.astro",
    Search: "./src/components/layout/Search.astro",
  },
})
