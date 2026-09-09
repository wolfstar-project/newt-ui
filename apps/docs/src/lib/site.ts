/*
 * Every fact the site states about itself lives here once. The object is
 * `as const`, so a page that reads `SITE.reactCli` gets the literal string and
 * not a widened `string` — a typo in a page is a type error, not a broken
 * install command a reader copies.
 */
export const SITE = {
  name: "newt/ui",
  tagline: "Discord-inspired components for React and Vue",
  /*
   * Tracks the registry release, not the npm version of the CLIs — the
   * registry is what a reader actually copies from, and it is cut separately
   * from `packages/*`.
   */
  version: "0.3.0",
  channel: "early access",
  license: "Apache-2.0",
  author: "WolfStar",
  github: "https://github.com/wolfstar-project/newt-ui",
  disclaimer:
    "https://github.com/wolfstar-project/newt-ui/blob/main/DISCLAIMER.md",
  // One CLI for both frameworks; it detects React or Vue during `init`.
  cli: "npx newtui@latest",
  nuxtModule: "@newtui/nuxt",
  url: "https://newtui.dev",
  registryUrl: "https://newtui.dev/r",
  vueRegistryUrl: "https://newtui.dev/vue/r",
  // The default `components.json` aliases; pages quote them when explaining
  // what an installed file imports.
  utilsAlias: "@/lib/utils",
  uiAlias: "@/components/ui",
  componentsAlias: "@/components",
  /*
   * Header links. A route lands here once it exists, so `main` never links to
   * a page a later phase still owes.
   */
  nav: [
    { href: "/docs", label: "Docs" },
    { href: "/docs/components", label: "Components" },
    { href: "/blocks", label: "Blocks" },
    { href: "/colors", label: "Colours" },
    { href: "/create", label: "Create" },
    { href: "/docs/changelog", label: "Changelog" },
  ],
} as const
