# @newtui/nuxt

Nuxt module for [newt/ui](https://wolfstar-project.github.io/newt-ui) — auto-imports the
Discord-native components you copied into your project with
[`newt-ui-vue`](../cli) and injects the `--newt-*` design tokens.

## Installation

```bash
pnpm add -D @newtui/nuxt
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@newtui/nuxt"],
})
```

Then add components as usual:

```bash
npx @newtui/vue add button
```

```vue
<template>
  <Button variant="primary">Send</Button>
</template>
```

No import needed — everything under `components/ui/**` is registered.

## Options

```ts
export default defineNuxtConfig({
  modules: ["@newtui/nuxt"],
  newt: {
    prefix: "Newt", // <NewtButton /> instead of <Button />. Default: "".
    componentDir: "components", // relative to srcDir. `<componentDir>/ui/**` is registered.
    css: true, // inject the --newt-* tokens stylesheet. Default: true.
  },
})
```

| Option         | Type      | Default        | Description                                                              |
| -------------- | --------- | -------------- | ------------------------------------------------------------------------ |
| `prefix`       | `string`  | `""`           | Prefix applied to every auto-imported component name.                    |
| `componentDir` | `string`  | `"components"` | Component directory relative to `srcDir`; `ui/**` inside it is used.     |
| `css`          | `boolean` | `true`         | Adds `runtime/tokens.css` (the `--newt-*` tokens) to `nuxt.options.css`. |

Set `css: false` if your global stylesheet already contains the tokens (for
example when `newt-ui-vue init` appended them to `assets/css/tailwind.css`).

## Tailwind

The module only ships the tokens. Utilities such as `bg-newt-bg-surface` come
from the newt/ui Tailwind preset — see the
[`nuxt-template`](../../templates/nuxt-template) for a ready-made
`tailwind.config.ts`.

## Development

```bash
pnpm build       # nuxt-module-build -> dist
pnpm typecheck   # tsc --noEmit
```
