# newt/ui

A Discord-styled component library for **React**, **Vue** and plain
**HTML/CSS**, built on a shared `--newt-*` design-token system. Copy-paste
components you own (shadcn-style), a CLI for each framework, and a docs site
per framework.

> **Not affiliated with Discord Inc.** newt/ui is an independent project,
> visually inspired by Discord's UI. See [`DISCLAIMER.md`](./DISCLAIMER.md).

## Repository layout

This is a pnpm + turborepo monorepo laid out like
[shadcn-ui/ui](https://github.com/shadcn-ui/ui) (React) and
[unovue/shadcn-vue](https://github.com/unovue/shadcn-vue) (Vue).

```
apps/
  www/                      React docs site (Next.js) — shadcn-ui layout
    registry/
      default/ui/*.tsx      React components (cva + cn + Tailwind, tokens via --newt-*)
      default/example/*.tsx Demos
      registry-ui.ts        Generated index of components
      registry-examples.ts  Generated index of demos
      schema.ts             registry-item zod schema
      meta/*.json           Per-component metadata (source for generated files)
    content/docs/
      components/*.mdx      Component docs
      installation/*.md     Setup guides (HTML, React, Next.js, Vue/Nuxt)
    components/docs/        Docs chrome: side nav, page header, section, preview frame
    registry-categories.ts  Side-nav taxonomy (6 groups, all 43 components)
    lib/utils.ts            cn()
    styles/globals.css      Tailwind v3 + --newt-* tokens
    styles/docs.css         Docs styling, ported from the original index.html
    components.json
  vue/                      Vue docs site (Nuxt 4) — shadcn-vue layout
    app/lib/registry/
      default/ui/<name>/    {Component.vue, index.ts} per component
      default/example/*.vue Demos
      schema.ts, registry-ui.ts, registry-examples.ts
    app/assets/css/main.css Tailwind v4 (`@theme`) + --newt-* tokens
    content/docs/           Markdown docs
packages/
  newt-ui/                  `@wolfstar/newt-ui` CLI (React) + registry/html (original HTML/CSS sources, tokens.css)
  cli/                      `@wolfstar/newt-ui-vue` CLI (Vue)
  module/                   `@wolfstar/nuxt-newt-ui` Nuxt module
templates/
  next-template/            Next.js starter preconfigured with newt/ui
  nuxt-template/            Nuxt starter preconfigured with newt/ui
```

## Quick start

### React

```bash
npx @wolfstar/newt-ui@latest init
npx @wolfstar/newt-ui@latest add button embed status-indicator
```

```tsx
import { Button } from "@/components/ui/button"

;<Button variant="primary">Primary</Button>
```

### Vue / Nuxt

```bash
npx @wolfstar/newt-ui-vue@latest init
npx @wolfstar/newt-ui-vue@latest add button embed status-indicator
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
npx @wolfstar/newt-ui --legacy init
npx @wolfstar/newt-ui --legacy add button embed
```

or via CDN:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@wolfstar/newt-ui@latest/registry/html/tokens.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@wolfstar/newt-ui@latest/registry/html/components/button.css"
/>
```

Detailed guides live in
[`apps/www/content/docs/installation/`](./apps/www/content/docs/installation/).

## Design tokens

`packages/newt-ui/registry/html/tokens.css` is the single source of truth.
Both apps map every token to Tailwind utilities (`bg-newt-brand`,
`text-newt-text-muted`, `rounded-md`, `shadow-elevation-high`, …) — `apps/www`
through the `newtPreset` in `tailwind.config.ts` (Tailwind v3), `apps/vue`
through an `@theme` block in `app/assets/css/main.css` (Tailwind v4). Never
hardcode a hex value that exists as a token. See the `newt-ui-registry` skill
for how one registry serves both majors.

## Development

```bash
pnpm install
pnpm dev                      # all apps
pnpm --filter www dev         # React docs
pnpm --filter vue-www dev     # Vue docs
pnpm typecheck
pnpm build
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

## Docs styling

Both docs sites reuse the look of the original single-page showcase
(`apps/www/public/legacy/index.html`): fixed 264px side nav, `package.json`
manifest column in the page header, numbered component sections with a sticky
head, and preview frames with a brand corner marker and a copy button. The CSS
is ported verbatim into `apps/www/styles/docs.css` and
`apps/vue/app/assets/css/docs.css`.
