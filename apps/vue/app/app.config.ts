/**
 * Site-wide, runtime-editable metadata for the docs app.
 * Read with `useAppConfig()` from any component.
 */
export default defineAppConfig({
  site: {
    name: "newt/ui",
    version: "0.1.0",
    channel: "early access",
    license: "MIT",
    author: "Newt Devs",
    cli: "npx newt-ui-vue",
  },
  links: {
    github: "https://github.com/newt-devs",
    repo: "https://github.com/newt-devs/newt-ui",
    setupGuides: "https://github.com/newt-devs/newt-ui/tree/main/docs/setup",
    disclaimer: "https://github.com/newt-devs/newt-ui/blob/main/DISCLAIMER.md",
  },
})
