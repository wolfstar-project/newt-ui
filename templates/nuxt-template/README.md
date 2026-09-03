# nuxt-template

A minimal [Nuxt 3](https://nuxt.com) starter preconfigured with
[newt/ui](https://newtui.dev) — Discord-native components you
copy into your project.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## What's already set up

- `src/assets/css/tailwind.css` — the `--newt-*` design tokens inside `@layer base`.
- `tailwind.config.ts` — the `newtPreset`, so `bg-newt-bg-surface`,
  `text-newt-text-primary`, `shadow-elevation-low`, `ease-newt` … all resolve to tokens.
- `components.json` — the newt/ui CLI config (`ui` -> `@/components/ui`,
  `utils` -> `@/lib/utils`, `framework` -> `nuxt`).
- `src/lib/utils.ts` — the `cn()` helper (clsx + tailwind-merge).
- `nuxt.config.ts` — `srcDir: "src/"` and `@nuxtjs/tailwindcss`.

## Adding components

```bash
npx @newtui/vue add button
npx @newtui/vue list
npx @newtui/vue diff button
```

Each component is a directory in `src/components/ui/` and is yours to edit:

```
src/components/ui/button/
├── Button.vue
└── index.ts
```

```vue
<script setup lang="ts">
import { Button } from "@/components/ui/button"
</script>

<template>
  <Button variant="primary">Send</Button>
</template>
```

### Auto-imports

Add the Nuxt module to drop the imports entirely:

```bash
pnpm add -D @newtui/nuxt
```

```ts
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@newtui/nuxt"],
  newt: { css: false }, // tokens already live in src/assets/css/tailwind.css
})
```

## Scripts

| Script           | Description                        |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Start the dev server               |
| `pnpm build`     | Production build                   |
| `pnpm generate`  | Static build                       |
| `pnpm preview`   | Preview the production build       |
| `pnpm typecheck` | `nuxt prepare && vue-tsc --noEmit` |

newt/ui is an independent project and is not affiliated with Discord Inc.
