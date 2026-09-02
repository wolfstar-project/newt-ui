/**
 * Site-wide, runtime-editable metadata for the docs app.
 * Read with `useAppConfig()` from any component.
 */
export default defineAppConfig({
  site: {
    name: "newt/ui",
    version: "0.1.0",
    channel: "early access",
    license: "Apache-2.0",
    author: "WolfStar",
    cli: "npx @newtui/vue",
  },
  links: {
    github: "https://github.com/wolfstar-project",
    repo: "https://github.com/wolfstar-project/newt-ui",
    setupGuides:
      "https://github.com/wolfstar-project/newt-ui/tree/main/docs/setup",
    disclaimer:
      "https://github.com/wolfstar-project/newt-ui/blob/main/DISCLAIMER.md",
  },
})
