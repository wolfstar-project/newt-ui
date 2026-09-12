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

- `packages/cli`: the `newtui` CLI, which serves React **and** Vue, **and**
  `registry/html/`, the canonical HTML/CSS/JS source of every component plus
  `tokens.css`. The legacy `newtui-html` bin (`cli/index.js`) copies straight
  out of that directory. This package owns the design tokens; nothing else may
  redefine a value.
- `deprecated/react-cli` (`@newtui/react`) and `deprecated/vue-cli`
  (`@newtui/vue`):
  deprecation wrappers. Each ships one bin that prints a notice and forwards to
  `newtui`. They hold no CLI logic and are removed in the next major.
- `packages/module`: `@newtui/nuxt`, auto-imports a consumer's
  `components/ui/**` and injects the tokens. Runtime-only; it never reads the
  registry.
- `apps/docs`: the documentation site, and the only place the two registries
  are shown side by side. Its chrome is `@prosefly/astro-theme-lotus`, a
  pinned and patched dependency: layouts, sidebar, search and footer come from
  the theme, and the app reaches it through `lotus({...})` in
  `astro.config.ts`, five slot overrides in `src/components/lotus/`, and
  `src/lib/lotus-nav.ts` / `src/lib/lotus-head.ts`. Read the docs site section
  of `AGENTS.md` before touching a layout, a route or `src/styles/lotus.css`.
- `apps/www`: React registry builder (Next.js), shadcn-ui layout. Owns
  `registry/meta/*.json`, which is the single input the generator reads for
  **both** frameworks.
- `apps/vue`: Vue registry builder (Nuxt 4 + Tailwind 4), shadcn-vue layout
  under root-level `registry/bases/newt/`. The Nuxt application shell remains
  under `app/`.
- `templates/*`: starter apps. They copy configuration from the docs apps;
  nothing imports them.
- `skills/newt-ui`: the skill published to consumers. It documents the CLI, the
  token rules and the trademark terms for somebody else's agent; the `.skills/*`
  set is for agents working inside this repository. Keep the two in step when a
  command or a rule changes.
- `tooling/oxc`: the shared oxlint/oxfmt configuration. `scripts/`: cross-
  workspace generation.

## Rules

- A component's visual truth is `packages/cli/registry/html/components/`.
  When the React and Vue versions disagree with it, the HTML is right.
- Never hardcode a colour, radius, font, shadow, or duration that already
  exists as a `--newt-*` token. If a value is missing, add the token first.
- `registry-ui.ts`, `registry-examples.ts`, `__registry__/`,
  `apps/*/registry.json`, and `apps/*/public/r/**` are
  **generated**. Edit `apps/www/registry/meta/<name>.json` and rerun the
  generator instead.
- The two registry apps intentionally sit on different Tailwind majors: `apps/www`
  on v3 (JS preset in `tailwind.config.ts`), `apps/vue` on v4 (CSS-first
  `@theme` in `app/assets/css/main.css`). That split is the compatibility test
  for the registry — do not "fix" it by aligning them. Everything Nuxt
  (`apps/vue`, `packages/module`, `templates/nuxt-template`) is on Nuxt 4, and
  `@nuxt/schema` is pinned in `pnpm-workspace.yaml` because two instances make
  `defineNuxtConfig` type-check as not callable.
- Nothing in `apps/*` may import from `packages/*` source; the apps consume
  the published registry contract, exactly like a user would.
- The docs theme is pinned to an exact version and patched in three places.
  Prefer a slot override or a `--lotus-*` mapping over a fourth hunk; if the
  patch outgrows three hunks, vendor the theme rather than keep patching it.

## Workflow

1. Read `AGENTS.md`, then the skill for the area you are touching
   (`newt-ui-registry`, `newt-ui-cli`, `newt-ui-components`).
2. Identify the narrowest package that owns the behaviour.
3. Check the import direction before adding a dependency.
4. Regenerate whatever is generated; never hand-edit the output.
5. Run `pnpm format`, `pnpm lint`, `pnpm knip`, `pnpm typecheck`, `pnpm build`.
6. Add a changeset when a published package (`packages/*`) changed.
