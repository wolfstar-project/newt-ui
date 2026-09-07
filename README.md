# newt/ui

A Discord-styled component library for **React**, **Vue** and plain
**HTML/CSS**, built on a shared `--newt-*` design-token system. Copy-paste
components you own (shadcn-style), a CLI for each framework, and one
documentation site that switches between the React and Vue sources.

> **Not affiliated with Discord Inc.** newt/ui is an independent project,
> visually inspired by Discord's UI. See [`DISCLAIMER.md`](./DISCLAIMER.md).

## Repository layout

This is a pnpm + turborepo monorepo laid out like
[shadcn-ui/ui](https://github.com/shadcn-ui/ui) (React) and
[unovue/shadcn-vue](https://github.com/unovue/shadcn-vue) (Vue).

```
apps/
  docs/                     The documentation site (Vite + React + Vue)
    src/site/               Chrome: shell, header, sidebar, code blocks, demo frames
    src/content/            Site config, nav tree, component model (from registry/meta)
    src/pages/              Home, Installation, component pages, 404
    src/vue/demos.ts        Vue demo loaders, mounted as islands inside React
    src/styles/site.css     Tailwind v4: site palette + the --newt-* token bridge
  www/                      React registry source + builder (Next.js)
    registry/
      default/ui/*.tsx      React components (cva + cn + Tailwind, tokens via --newt-*)
      default/example/*.tsx Demos
      registry-ui.ts        Generated index of components
      registry-examples.ts  Generated index of demos
      registry-categories.ts  Sidebar taxonomy (6 groups, all 43 components)
      schema.ts             registry-item zod schema
      meta/*.json           Per-component metadata (source for generated files)
    lib/utils.ts            cn()
    styles/globals.css      Tailwind v3 + --newt-* tokens
    scripts/build-registry.mts  Emits public/r for the React CLI
    components.json
  vue/                      Vue registry source + builder (Nuxt 4)
    app/lib/registry/
      default/ui/<name>/    {Component.vue, index.ts} per component
      default/example/*.vue Demos
      schema.ts, registry-ui.ts, registry-examples.ts
    app/assets/css/main.css Tailwind v4 (`@theme`) + --newt-* tokens
    scripts/build-registry.mts  Emits public/r for the Vue CLI
packages/
  newtui/                   `newtui` CLI (React + Vue) + registry/html (original HTML/CSS sources, tokens.css)
  newt-ui/                  `@newtui/react` deprecation wrapper around `newtui`
  cli/                      `@newtui/vue` deprecation wrapper around `newtui`
  module/                   `@newtui/nuxt` Nuxt module
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
[`apps/docs/src/pages/Installation.tsx`](./apps/docs/src/pages/Installation.tsx).

## Design tokens

`packages/newtui/registry/html/tokens.css` is the single source of truth.
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
per component; `pnpm --filter docs docs:gen` writes a stub for any component
that does not have one yet. Every page is also served as markdown at the same
path plus `.md`, and `/llms.txt` indexes them.

The two registries are consumed in place through path aliases (`@/registry` →
`apps/www/registry`, `@/lib/registry` → `apps/vue/app/lib/registry`), so a
component only ever exists once. At build time the site copies both `public/r`
outputs into its own `dist/`, which is why `apps/www` and `apps/vue` remain in
the repository as registry builders even though they no longer ship pages.
`scripts/verify-dist.mjs` then asserts that those files, the markdown twins and
the search index all landed: the site and the registry CDN are one deployment.
