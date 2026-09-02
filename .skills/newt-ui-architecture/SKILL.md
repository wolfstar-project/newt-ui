---
name: newt-ui-architecture
description: Use when adding features, moving code, or changing dependencies across newt/ui apps, packages, and templates.
---

# newt/ui architecture

Every component exists in three forms. Keep them in sync and keep the
dependency direction one-way: the HTML/CSS spec feeds the framework
registries, the registries feed the docs sites and the CLIs, and nothing
flows back.

## Package ownership

- `packages/newt-ui`: the `@newtui/react` CLI (React) **and** `registry/html/`, the
  canonical HTML/CSS/JS source of every component plus `tokens.css`. The
  legacy `newt-ui-html` bin (`cli/index.js`) copies straight out of that
  directory. This package owns the design tokens; nothing else may redefine a
  value.
- `packages/cli`: the `@newtui/vue` CLI. Same command surface as `@newtui/react`,
  different targets (`components/ui/<name>/` directories instead of one file).
  Logic is deliberately duplicated between the two CLIs rather than shared —
  they publish independently and must not depend on each other.
- `packages/module`: `@newtui/nuxt`, auto-imports a consumer's
  `components/ui/**` and injects the tokens. Runtime-only; it never reads the
  registry.
- `apps/www`: React docs site (Next.js), shadcn-ui layout. Owns
  `registry/meta/*.json`, which is the single input the generator reads for
  **both** frameworks.
- `apps/vue`: Vue docs site (Nuxt 4 + Tailwind 4), shadcn-vue layout under
  `app/lib/registry/`, markdown under `content/`.
- `templates/*`: starter apps. They copy configuration from the docs apps;
  nothing imports them.
- `tooling/oxc`: the shared oxlint/oxfmt configuration. `scripts/`: cross-
  workspace generation.

## Rules

- A component's visual truth is `packages/newt-ui/registry/html/components/`.
  When the React and Vue versions disagree with it, the HTML is right.
- Never hardcode a colour, radius, font, shadow, or duration that already
  exists as a `--newt-*` token. If a value is missing, add the token first.
- `registry-ui.ts`, `registry-examples.ts`, `__registry__/`,
  `packages/*/registry.json`, and `apps/*/public/r/**` are **generated**. Edit
  `apps/www/registry/meta/<name>.json` and rerun the generator instead.
- The two docs apps intentionally sit on different Tailwind majors: `apps/www`
  on v3 (JS preset in `tailwind.config.ts`), `apps/vue` on v4 (CSS-first
  `@theme` in `app/assets/css/main.css`). That split is the compatibility test
  for the registry — do not "fix" it by aligning them. Everything Nuxt
  (`apps/vue`, `packages/module`, `templates/nuxt-template`) is on Nuxt 4, and
  `@nuxt/schema` is pinned in `pnpm-workspace.yaml` because two instances make
  `defineNuxtConfig` type-check as not callable.
- Nothing in `apps/*` may import from `packages/*` source; the apps consume
  the published registry contract, exactly like a user would.

## Workflow

1. Read `AGENTS.md`, then the skill for the area you are touching
   (`newt-ui-registry`, `newt-ui-cli`, `newt-ui-components`).
2. Identify the narrowest package that owns the behaviour.
3. Check the import direction before adding a dependency.
4. Regenerate whatever is generated; never hand-edit the output.
5. Run `pnpm format`, `pnpm lint`, `pnpm knip`, `pnpm typecheck`, `pnpm build`.
6. Add a changeset when a published package (`packages/*`) changed.
