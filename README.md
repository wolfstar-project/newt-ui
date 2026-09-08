# newt/ui

A Discord-styled component library for **React**, **Vue** and plain
**HTML/CSS**, built on a shared `--newt-*` design-token system. Copy-paste
components you own (shadcn-style), one multi-framework CLI, and one
documentation site that switches between the React and Vue sources.

> **Not affiliated with Discord Inc.** newt/ui is an independent project,
> visually inspired by Discord's UI. See [`DISCLAIMER.md`](./DISCLAIMER.md).

## Repository layout

This is a pnpm + turborepo monorepo laid out like
[shadcn-ui/ui](https://github.com/shadcn-ui/ui) (React) and
[unovue/shadcn-vue](https://github.com/unovue/shadcn-vue) (Vue).

```
apps/
  docs/                     Shared Astro docs (MDX + React/Vue islands)
    src/content/docs/       Guides and one page per component
    src/components/         Site chrome, code blocks, and preview frames
    src/lib/                Registry metadata and paired demo loaders
    src/styles/site.css     Tailwind v4 + the --newt-* token bridge
  www/                      React registry source + builder (Next.js)
    __registry__/           Generated React loaders
    registry.json           Generated public registry manifest
    registry/
      bases/newt/ui/*.tsx   React components (cva + cn + Tailwind)
      bases/newt/blocks/    Composed React blocks
      bases/newt/examples/  React demos
      registry-ui.ts        Generated index of components
      registry-examples.ts  Generated index of demos
      registry-categories.ts  Shared sidebar taxonomy
      schema.ts             registry-item zod schema
      meta/*.json           Per-component metadata (source for generated files)
    lib/utils.ts            cn()
    styles/globals.css      Tailwind v3 + --newt-* tokens
    scripts/build-registry.mts  Emits public/r for the React CLI
    components.json
  vue/                      Vue registry source + builder (Nuxt 4)
    __registry__/           Generated Vue loaders
    registry.json           Generated public registry manifest
    registry/
      bases/newt/ui/<name>/ {Component.vue, index.ts} per component
      bases/newt/blocks/    Composed Vue blocks
      bases/newt/examples/  Vue demos
      schema.ts, registry-ui.ts, registry-examples.ts
    app/assets/css/main.css Tailwind v4 (`@theme`) + --newt-* tokens
    scripts/build-registry.mts  Emits public/r for the Vue CLI
packages/
  cli/                      `newtui` CLI (React + Vue) + registry/html
    src/commands/           Command orchestration
    src/preflights/         Target-project validation
    src/registry/           Wire schemas, fetching, dependency resolution
    src/utils/transformers/ Consumer source/import transforms
    src/utils/updaters/     File, CSS, and dependency updates
  module/                   `@newtui/nuxt` Nuxt module
deprecated/
  react-cli/                `@newtui/react` forwarding wrapper
  vue-cli/                  `@newtui/vue` forwarding wrapper
templates/
  next-template/            Next.js starter preconfigured with newt/ui
  nuxt-template/            Nuxt starter preconfigured with newt/ui
```

## Quick start

### React

```bash
npx newtui@latest init
npx newtui@latest add button embed status-indicator
```

```tsx
import { Button } from "@/components/ui/button"

const component = () => <Button variant="primary">Primary</Button>
```

### Vue / Nuxt

```bash
npx newtui@latest init
npx newtui@latest add button embed status-indicator
```

```vue
<script setup lang="ts">
import { Button } from "@/components/ui/button"
</script>

<template>
  <Button variant="primary">Primary</Button>
</template>
```

### Plain HTML / CSS

```bash
npx newtui --legacy init
npx newtui --legacy add button embed
```

or via CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/newtui@latest/registry/html/tokens.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/newtui@latest/registry/html/components/button.css"
/>
```

One CLI serves both frameworks: `init` detects React or Vue and records the
result as `framework` in `components.json`, which every later command reads
back. Pass `--framework react|vue` to override it.

Detailed guides live on the documentation site (`apps/docs`), which serves the
same installation page for React and Vue behind a framework switcher — see
[`apps/docs/src/content/docs/installation.mdx`](./apps/docs/src/content/docs/installation.mdx).

## Design tokens

`packages/cli/registry/html/tokens.css` is the single source of truth.
Every app maps the tokens to Tailwind utilities (`bg-newt-brand`,
`text-newt-text-muted`, `rounded-md`, `shadow-elevation-high`, …) — `apps/www`
through the `newtPreset` in `tailwind.config.ts` (Tailwind v3), `apps/vue` and
`apps/docs` through an `@theme` block (Tailwind v4). Never hardcode a hex value
that exists as a token. See the `newt-ui-registry` skill for how one registry
serves both majors.

The documentation site keeps two palettes apart: its own chrome (header,
sidebar, code blocks) draws from a site palette declared in
`apps/docs/src/styles/site.css`, while every component demo renders inside a
`.newt-root` frame that uses the `--newt-*` tokens unchanged.

## Development

```bash
pnpm install
pnpm dev                      # all apps
pnpm --filter docs dev        # the documentation site
pnpm typecheck
pnpm build
pnpm registry:build           # rebuild apps/*/public/r from registry sources
node scripts/gen-registry.mjs # regenerate registry indexes from registry/meta
```

See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and
[`AGENT_GUIDE.md`](./AGENT_GUIDE.md) for conventions.

## Credits

newt/ui was originally created by [newt-max](https://github.com/newt-max),
who granted permission for this fork to be maintained here on the condition
that the original authorship is credited. This repository builds on that work
— the design tokens, the component set, and the HTML/CSS spec all originate
from it. See [`NOTICE`](./NOTICE).

## License

[Apache-2.0](./LICENSE) — see [`NOTICE`](./NOTICE) for the original
authorship.

## Using it with an agent

`npx skills add wolfstar-project/newt-ui` installs the skill in
[`skills/newt-ui`](./skills/newt-ui), which teaches an agent the registry, the
`--newt-*` token rules and the review checklist. `npx newtui@latest mcp init
--client claude` wires up the MCP server, which serves the registry to the same
agent as tools. Both are documented at
[newtui.dev/docs/skills](https://newtui.dev/docs/skills) and
[/docs/mcp](https://newtui.dev/docs/mcp).

## Documentation site

`apps/docs` is an Astro site that runs React and Vue side by side: pages are
static HTML built from MDX, and each preview mounts a React island and a Vue
island together. The framework switcher in the header decides which one paints
and which install command, import line and code block is shown — the choice
survives a reload through `localStorage`, and the markup for both is rendered
at build time, so switching costs nothing.

Content lives in `src/content/docs/**/*.mdx`, one file per page including one
per registry item; `pnpm --filter docs docs:gen` writes a source-derived starter
with prose, API tables and accessibility guidance for any item that does not
have one yet. Every page is also served as markdown at the same
path plus `.md`, and `/llms.txt` indexes them.

The two registries are consumed in place through path aliases (`@/registry` →
`apps/www/registry`, `@/lib/registry` → `apps/vue/registry`), so a
component only ever exists once. At build time the site copies both `public/r`
outputs into its own `dist/`, which is why `apps/www` and `apps/vue` remain in
the repository as registry builders even though they no longer ship pages.
`scripts/verify-dist.mjs` then asserts that those files, the markdown twins and
the search index all landed: the site and the registry CDN are one deployment.
