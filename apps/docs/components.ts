import { defineComponents } from "blume"

/*
 * What the content writes without importing, and the pieces of Blume's
 * chrome this site replaces.
 *
 * Every `mdx` entry is a name the content files use as a tag. The
 * registry-driven ones (`ComponentPreview`, `Installation`, `Usage`,
 * `TokensNote`) read `apps/www/registry/meta`; the rest are the site's own
 * primitives. `Callout` replaces Blume's with the one the site always had.
 * `ReactDemo` and `VueDemo` are registered as islands so Blume wires up both
 * renderers — `ComponentPreview` mounts them itself, and nothing else about a
 * `.vue` file would tell Blume the site needs Vue.
 *
 * The `layout` slots put back the chrome the site had before the Lotus port:
 * its header (wordmark, primary links, search, the React/Vue switch, the
 * theme toggle), its sidebar, its table of contents, its pager, the
 * copy-page menu beside the title, and its footer with the trademark
 * disclaimer. The breadcrumb trail it never had is emptied. Blume keeps the
 * document head, the grid, the drawer, search and every generated route.
 *
 * Blume reads this file statically, so every entry is a path string or an
 * object literal — never a value computed here.
 */
export default defineComponents({
  mdx: {
    Callout: "./src/components/mdx/Callout.astro",
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
    Breadcrumbs: "./src/components/layout/NoBreadcrumbs.astro",
    Footer: "./src/components/layout/Footer.astro",
    Header: "./src/components/layout/Header.astro",
    PageHeader: "./src/components/layout/PageHeader.astro",
    Pagination: "./src/components/layout/Pager.astro",
    Sidebar: "./src/components/layout/Sidebar.astro",
    TableOfContents: "./src/components/layout/Toc.astro",
  },
})
