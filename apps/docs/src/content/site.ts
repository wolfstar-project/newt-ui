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
  reactCli: "npx @wolfstar/newt-ui@latest",
  vueCli: "npx @wolfstar/newt-ui-vue@latest",
  nuxtModule: "@wolfstar/nuxt-newt-ui",
  registryUrl: "https://newtui.dev/r",
  vueRegistryUrl: "https://newtui.dev/vue/r",
} as const
