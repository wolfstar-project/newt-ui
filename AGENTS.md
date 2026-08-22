# AGENTS.md — newt/ui

Instructions for AI agents (and humans) working in this repository. This file
is the canonical source; `CLAUDE.md` is a symlink to it.

## What this is

newt/ui is a Discord-styled component library shipped for **React**,
**Vue**, and plain **HTML/CSS**, all built on a shared `--newt-*` design
token system. Components are copy-paste (shadcn-style): the CLI copies
source into the user's project, there is no runtime package dependency.

## Repository layout

```
apps/
  www/    React docs site (Next.js) — shadcn-ui layout: registry/default/{ui,example}
  vue/    Vue docs site (Nuxt 4 + Tailwind 4) — shadcn-vue layout: app/lib/registry/default/ui/<name>/
packages/
  newt-ui/   `@wolfstar/newt-ui` CLI (React) + registry/html (original HTML/CSS + tokens.css)
  cli/       `@wolfstar/newt-ui-vue` CLI
  module/    `@wolfstar/nuxt-newt-ui` Nuxt module
templates/
  next-template/, nuxt-template/   Starter apps preconfigured with newt/ui
tooling/oxc/   Shared oxlint + oxfmt configuration
scripts/       Cross-workspace scripts (registry generation)
```

See `CONTRIBUTING.md` for the full breakdown and `README.md` for the
quick-start and design-token overview.

## Commands

Run from the repo root unless noted otherwise.

```bash
pnpm install              # install everything (pnpm 11, Node >=22.11)
pnpm dev                  # run every app in watch mode
pnpm build                # turbo: build all apps/packages
pnpm typecheck             # turbo: tsc --noEmit everywhere
pnpm lint                  # turbo: oxlint everywhere
pnpm lint:fix               # oxlint --fix everywhere
pnpm format                 # oxfmt --write everywhere
pnpm format:check            # oxfmt --check (what CI runs)
pnpm knip                   # unused files/exports/dependencies
pnpm test                   # turbo: unit tests (per package)
pnpm registry:build          # rebuild apps/*/public/r from registry sources
node scripts/gen-registry.mjs  # regenerate registry-ui.ts / registry-examples.ts / __registry__ from registry/meta
pnpm changeset               # record a changeset for a release
```

Before opening a PR, run `format:check`, `lint`, and `knip` locally — CI
runs all three plus `typecheck`, `build`, and `zizmor`.

## Toolchain specifics

- **Package manager**: pnpm 11. All `.npmrc`-style settings
  (`autoInstallPeers`, `strictPeerDependencies`, `shamefullyHoist`) and the
  `typescript` override live in `pnpm-workspace.yaml`, not `.npmrc`.
- **TypeScript**: `typescript` is overridden to `typescript-native-bridge`
  (a drop-in fork whose checker runs on tsgo, Microsoft's Go TypeScript
  compiler, in-process). `tsc`/`vue-tsc` behave the same from the outside;
  `tsconfig.json` must not set `baseUrl` (removed in this fork — `paths`
  alone resolves relative to the tsconfig file).
- **Format + lint**: `oxfmt` and `oxlint` (both from the Oxc toolchain),
  configured in `tooling/oxc/`. No Prettier, no ESLint. `oxlint` runs with
  `typeAware`/`typeCheck` on and `maxWarnings: 0` — fix warnings, don't
  suppress them, unless there's a genuine reason (use a scoped
  `// oxlint-disable-next-line <rule> -- <reason>` comment in that case).
- **Releases**: Changesets v3 (`@changesets/cli`). Requires Node
  `^22.11 || ^24 || >=26`. Run `pnpm changeset` when a change should ship in
  the next release.
- **Skills**: project-specific skills are hand-written in `.skills/<name>/SKILL.md`
  and symlinked into `.claude/skills/` (same split as `wolfstar-project/agent-zero`):
  `newt-ui-architecture`, `newt-ui-registry`, `newt-ui-cli`,
  `newt-ui-components`, `newt-ui-trademark`. Read the one that matches what you
  are touching before you start. Third-party skills are managed by
  [skilld](https://skilld.dev); they live in `.claude/skills/` too and are
  pinned by `.claude/skills/skilld-lock.yaml` (the local ones are deliberately
  not in that lockfile, and `skilld prepare` leaves them alone).
  `pnpm skills:install` restores them from the lock file, `pnpm skills:list`
  shows what's installed, and `pnpm skills:add <owner/repo> --skill <names>`
  adds more. The `prepare` script runs `skilld prepare --agent claude-code`
  automatically after `pnpm install`. Skill sets are aligned with
  `wolfstar-project/agent-zero` and `wolfstar-project/wolfstar.rocks`.

## Design tokens

`packages/newt-ui/registry/html/tokens.css` is the single source of truth
for every `--newt-*` CSS variable. Both docs apps mirror it into their own
global stylesheet and map every token to a Tailwind utility (`bg-newt-brand`,
`text-newt-text-muted`, `rounded-md`, `shadow-elevation-high`, …) — `apps/www`
through the `newtPreset` in `tailwind.config.ts` (Tailwind v3), `apps/vue`
through an `@theme` block in `app/assets/css/main.css` (Tailwind v4). Never
hardcode a hex value that already exists as a token. See the
`newt-ui-registry` skill for how one registry serves both majors.

## Adding or changing a component

Read `AGENT_GUIDE.md` first — it documents naming conventions, the token
system, accessibility requirements, and a full worked example. Short
version:

1. Original HTML/CSS (if authoring the canonical spec) goes in
   `packages/newt-ui/registry/html/components/<name>.{css,html,js}`.
2. React: `apps/www/registry/default/ui/<name>.tsx` (cva + `cn` + Tailwind),
   `apps/www/registry/default/example/<name>-demo.tsx`,
   `apps/www/content/docs/components/<name>.mdx`.
3. Vue: `apps/vue/app/lib/registry/default/ui/<name>/{Pascal.vue,index.ts}`,
   `apps/vue/app/lib/registry/default/example/PascalDemo.vue`,
   `apps/vue/content/docs/components/<name>.md`.
4. Add `apps/www/registry/meta/<name>.json` (title, description,
   dependencies, registryDependencies, vueFiles) — this drives the
   generated registry indexes.
5. Add the component to a category in
   `apps/www/registry/registry-categories.ts` (and its Vue copy) so it
   appears in the docs side nav.
6. Run `node scripts/gen-registry.mjs`, then `pnpm typecheck && pnpm build`.

## Trademark note

newt/ui is an independent, community-built project. It is _visually
inspired by_ Discord's client design but is **not affiliated with,
endorsed by, or sponsored by Discord Inc.** See `DISCLAIMER.md` — its
terms (no Discord logos/wordmarks, no copyrighted assets, "Discord-inspired"
framing in all copy) apply to every component, doc page, and example.

<!-- skilld -->

Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.
<!-- /skilld -->
