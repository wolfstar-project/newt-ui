# nuxt-template

A minimal [Nuxt 4](https://nuxt.com) starter preconfigured with
[newt/ui](https://newtui.dev) — Discord-native components you
copy into your project.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## What's already set up

- `app/assets/css/main.css` — the `--newt-*` design tokens inside `@layer base`.
- `nuxt.config.ts` — `future: { compatibilityVersion: 4 }`, so Nuxt's own
  source root is `app/`, and `@tailwindcss/vite`.
- `components.json` — the newt/ui CLI config (`ui` -> `@/components/ui`,
  `utils` -> `@/lib/utils`, `framework` -> `nuxt`).
- `app/lib/utils.ts` — the `cn()` helper.

## Adding components

```bash
npx newtui add button
npx newtui list
npx newtui diff button
```

Each component is a directory in `app/components/ui/` and is yours to edit:

```
app/components/ui/button/
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
  modules: ["@newtui/nuxt"],
  newt: { css: false }, // tokens already live in app/assets/css/main.css
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
