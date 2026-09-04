---
name: newt-ui-registry
description: Use when changing the registry schema, the generated registry indexes, design tokens, or anything that must work on both Tailwind v3 and v4.
---

# newt/ui registry

The registry is the published contract between this repository and a user's
project. It follows the shadcn `registry-item.json` schema so the standard
tooling and mental model apply.

## Generation pipeline

```
apps/www/registry/meta/<name>.json          <- the only hand-written input
        |  node scripts/gen-registry.mjs
        v
apps/www/registry/registry-ui.ts            (React index)
apps/www/registry/registry-examples.ts
apps/www/__registry__/{index.tsx,demos.tsx} (demos: static imports, so docs prerender)
apps/vue/app/lib/registry/registry-ui.ts    (Vue index)
apps/vue/app/lib/registry/registry-examples.ts
apps/vue/app/__registry__/index.ts
packages/newtui/registry.react.json         (shadcn registry schema)
packages/newtui/registry.vue.json
        |  apps/*/scripts/build-registry.mts
        v
apps/*/public/r/{index.json,styles/<style>/<name>.json}   <- what the CLI fetches
```

The generator also warns about missing files. A `missing:` line is a failure,
not a note.

## Rules

- Add a component by writing `meta/<name>.json` (`title`, `description`,
  `dependencies`, `registryDependencies`, `vueFiles`, `reactDemo`, `vueDemo`)
  and putting it in a category in `registry-categories.ts` (both copies).
- `registryDependencies` names other newt/ui components and must be resolvable
  recursively by the CLI. `dependencies` names npm packages only.
- Every published item carries `framework: "react" | "vue"`, stamped by the
  app's `build-registry.mts` (React items come from `apps/www`, Vue items from
  `apps/vue`). The field is part of `registryItemSchema`, so adding a field
  means editing all four copies of that schema — `apps/www/registry`,
  `apps/vue/app/lib/registry`, and `packages/newtui/src/tools` — or the
  build-time `parse` strips it before the CLI ever sees it.
- Never hand-edit a generated file. Regenerate.
- Token values live once, in `apps/www/registry/registry-tokens.ts`, mirroring
  `packages/newtui/registry/html/tokens.css`. Changing a colour means
  changing those two, then regenerating.

## Tailwind v3 and v4 must both work

One registry serves both majors. The `theme-newt` item carries the tokens in
all three shapes (components themselves usually carry none — they are styled
entirely by these), and it is published to
`public/r/styles/<style>/theme-newt.json` even though it has no `files`:

- `cssVars.dark` — the raw `--newt-*` variables. This is the public contract:
  a consumer overrides one variable and the whole library restyles, exactly
  like the plain HTML/CSS distribution.
- `cssVars.theme` — the Tailwind **v4** `@theme` entries. v4 has no JS config;
  utilities come from namespaced custom properties, so `--color-newt-brand`
  is what produces `bg-newt-brand`/`text-newt-brand`/`border-newt-brand`,
  `--radius-md` produces `rounded-md`, `--shadow-elevation-high`,
  `--ease-newt`, and so on. Entries reference the raw variables
  (`--color-newt-brand: var(--newt-brand)`), they do not duplicate hex values.
- `tailwind.config.theme.extend` — the Tailwind **v3** form of the same map.
  The schema marks `tailwind` deprecated upstream; we keep emitting it
  precisely because v3 consumers are still supported.
- `css` — additional `@layer`/`@utility`/`@keyframes` rules when a component
  needs them.

When you add or rename a token, update `newtTokens`, `tailwindV3Theme`, and
`tailwindV4Theme` together, or v3 and v4 consumers silently diverge.

## How the CLIs consume it

`init` fetches `theme-newt`, detects the project's Tailwind major
(`src/tools/tailwind.ts`: declared `tailwindcss` dependency first, then the
stylesheet's `@import "tailwindcss"` vs `@tailwind` directives, then the
presence of a `tailwind.config.*`) and writes the matching shape — an `@theme`
block for v4, the raw variables plus a printed preset for v3. `add` appends any
`cssVars`/`css` an item carries, rendered for that same major. An unreachable
registry falls back to the tokens bundled in the package.

Never hand-write a v3 preset in the CLI: print
`theme.tailwind.config.theme.extend` from the fetched item, or it will drift
from the classes the components actually use.

## Workflow

1. Change `meta/`, tokens, or the schema.
2. `node scripts/gen-registry.mjs` — zero `missing:` lines.
3. `pnpm registry:build` in both apps.
4. Verify a component's built JSON actually contains what you expect
   (`apps/www/public/r/styles/default/<name>.json`).
5. Smoke-test at least one `add` through a CLI against a local registry
   before claiming the contract still works.
