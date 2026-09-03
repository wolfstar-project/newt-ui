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
  newt-ui/                  `@newtui/react` CLI (React) + registry/html (original HTML/CSS sources, tokens.css)
  cli/                      `@newtui/vue` CLI (Vue)
  module/                   `@newtui/nuxt` Nuxt module
templates/
  next-template/            Next.js starter preconfigured with newt/ui
  nuxt-template/            Nuxt starter preconfigured with newt/ui
```

## Quick start

### React

```bash
npx @newtui/react@latest init
npx @newtui/react@latest add button embed status-indicator
```

```tsx
import { Button } from "@/components/ui/button"

;<Button variant="primary">Primary</Button>
```

### Vue / Nuxt

```bash
npx @newtui/vue@latest init
npx @newtui/vue@latest add button embed status-indicator
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
npx @newtui/react --legacy init
npx @newtui/react --legacy add button embed
```

or via CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@newtui/react@latest/registry/html/tokens.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@newtui/react@latest/registry/html/components/button.css"
/>
```

Detailed guides live on the documentation site (`apps/docs`), which serves the
same installation page for React and Vue behind a framework switcher — see
[`apps/docs/src/pages/Installation.tsx`](./apps/docs/src/pages/Installation.tsx).

## Design tokens

`packages/newt-ui/registry/html/tokens.css` is the single source of truth.
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

## Documentation site

`apps/docs` is a Vite app that runs React and Vue side by side: React renders
the site, and each Vue demo is mounted as an island in a React node. The
framework switcher in the sidebar decides which registry a page reads from —
every install command, import line and live demo follows it — and the choice
survives a reload through `localStorage`.

The two registries are consumed in place through Vite path aliases
(`@/registry` → `apps/www/registry`, `@/lib/registry` →
`apps/vue/app/lib/registry`), so a component only ever exists once. At build
time the site copies both `public/r` outputs into its own `dist/`, which is why
`apps/www` and `apps/vue` remain in the repository as registry builders even
though they no longer ship pages.
