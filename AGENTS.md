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
  docs/   THE documentation site (Blume: MDX on Astro, React and Vue islands).
          One site for both frameworks: a React/Vue switcher picks which
          registry renders each demo. Content is `content/docs/**/*.mdx`; it
          reads `apps/www/registry` and `apps/vue/registry` directly through
          path aliases and bundles both built registries into its own `dist/`.
          The chrome is Blume's — see the docs site section below before
          changing the config, a page, a component override or a style.
  www/    React registry source + builder (Next.js) — shadcn-ui layout:
          registry/bases/newt/{ui,blocks,examples}. No longer ships docs pages.
  vue/    Vue registry source + builder (Nuxt 4 + Tailwind 4) — shadcn-vue
          layout: registry/bases/newt/{ui,blocks,examples}. No longer ships docs
          pages.
packages/
  cli/       `newtui` CLI (React + Vue) + registry/html (original HTML/CSS + tokens.css)
  module/    `@newtui/nuxt` Nuxt module
deprecated/
  react-cli/ `@newtui/react` deprecation wrapper forwarding to `newtui`
  vue-cli/   `@newtui/vue` deprecation wrapper forwarding to `newtui`
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
pnpm lint                  # oxlint over the whole repo, in one process
pnpm lint:fix               # the same, with --fix
pnpm format                 # oxfmt --write everywhere
pnpm format:check            # oxfmt --check
pnpm quality                # turbo: lint + format:check, both cached
pnpm quality:fix             # turbo: lint:fix + format
pnpm knip                   # unused files/exports/dependencies
pnpm test                   # turbo: unit tests (per package)
pnpm registry:build          # rebuild apps/*/public/r from registry sources
node scripts/gen-registry.mjs  # regenerate registry-ui.ts / registry-examples.ts / __registry__ from registry/meta
pnpm changeset               # record a changeset for a release
```

Before opening a PR, run `quality` and `knip` locally — CI runs both plus
`typecheck`, `build`, and `zizmor`.

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
  Both are **root tasks**, not per-package scripts: oxlint reads the whole
  repo in about three seconds, so fanning it out across nine workspaces cost
  more than it saved and left each package unable to see the others. No
  workspace declares a `lint` script. The docs app's `src/env.d.ts`
  references `astro/client`, which is what the type-aware rules resolve
  `import.meta.glob` through without a `blume check` having run first.
- **Releases**: Changesets v3 (`@changesets/cli`). Requires Node
  `^22.11 || ^24 || >=26`. Run `pnpm changeset` when a change should ship in
  the next release.
- **Consumer skill**: `skills/newt-ui/` is published for
  `npx skills add wolfstar-project/newt-ui` — it teaches a user's agent the
  registry, the token rules and the review checklist. It is not one of the
  contributor skills below and is not managed by skilld.
- **Skills**: `.skills/<name>/` is the canonical shared location for every
  skill. Each directory is symlinked into both `.claude/skills/` and
  `.agents/skills/` so Claude Code and Codex read the same files. The
  project-specific skills are hand-written:
  `newt-ui-architecture`, `newt-ui-registry`, `newt-ui-cli`,
  `newt-ui-components`, `newt-ui-trademark`. Read the one that matches what you
  are touching before you start. Third-party skills are managed by
  [skilld](https://skilld.dev) and pinned by `.skills/skilld-lock.yaml`; the
  hand-written skills are deliberately not in that lockfile.
  `pnpm skills:install` restores them from the lock file, `pnpm skills:list`
  shows what's installed, and `pnpm skills:add <owner/repo> --skill <names>`
  adds more. The `prepare` script runs `skilld prepare --agent claude-code`
  automatically after `pnpm install`. Skill sets are aligned with
  `wolfstar-project/agent-zero` and `wolfstar-project/wolfstar.rocks`.

## The docs site

`apps/docs` runs on [Blume](https://useblume.dev), the Markdown-first docs
framework on Astro: `blume dev` and `blume build` generate and drive a hidden
Astro project under `apps/docs/.blume/` (gitignored), so the app owns its
content, a config file and a handful of overrides and nothing else. What that
means in practice:

- **Content is `content/`.** `content/docs/**/*.mdx` is the documentation,
  which is why every route starts with `/docs`; `content/changelog/*.mdx` are
  `type: changelog` entries Blume collects into the `/changelog` index. Blume's
  frontmatter is strict — an unknown key fails the build — and explicit heading
  anchors are written `## Title [#id]`, never `{#id}`, which MDX reads as an
  expression.
- **`blume.config.ts` is the site.** It builds the explicit sidebar from `NAV`
  in `src/lib/nav.ts` (the guides, then one group per registry category, read
  from `apps/www/registry/meta` through `src/lib/registry-meta.ts`), the header
  links from `SITE.nav`, the Open Graph palette, the redirects for the two
  routes that moved (`/colors`, `/docs/changelog`), and the
  `agents.markdownComponents` serialisers that give every registry-driven tag
  a Markdown form for the `.md` twins and `llms.txt`. It is evaluated by the
  CLI _and_ by the generated Astro config, so keep it a pure read of the
  registry.
- **`components.ts` names what MDX writes without importing**:
  `ComponentPreview`, `Installation`, `Usage`, `TokensNote`, `PropsTable`,
  `PmTabs`, `PathTabs`, `FrameworkGrid`, `TokenReference` and `ComponentIndex`
  under `src/components/mdx/`, built on Blume's own `Tabs`, `Steps`,
  `TypeTable`, `Card` and `CodeBlock`. `ReactDemo` and `VueDemo` are registered
  as islands there so Blume wires up both renderers; `ComponentPreview` mounts
  them itself. Two layout slots are overridden in `src/components/layout/`:
  `Search`, which is the built-in trigger with the React/Vue switch beside it,
  and `Footer`, which is where the trademark disclaimer lives. Blume reads this
  file statically — every entry is a path string or an object literal.
- **Pages that are not documents live in `pages/`**: the home page, `/blocks`,
  `/create`, `/typeset` and `/typeset/preview`, each wrapped in
  `pages/_site/SiteLayout.astro`, which hands Blume's `PageLayout` the resolved
  config from `blume:data`. The 404, the `.md` twins, `llms.txt`, the sitemap,
  search (Orama, local), Open Graph cards and the component index page are
  Blume's.
- **`theme.css` is spliced into the Tailwind entry Blume generates**, so it
  must not `@import "tailwindcss"`. Section (a) maps the `--newt-*` tokens onto
  Tailwind namespaces so the registry demos get their utilities (`@source`
  names both registries); section (b) redefines every `--blume-*` token the
  chrome reads in terms of a `--newt-*` token — that mapping is why the header
  toggle moves the chrome and the demos together. The light palette keys on
  Blume's `data-theme="light"`. The Typeset stylesheet is imported through the
  `@newt-html/*` path alias in `tsconfig.json`, which Blume hands to Vite along
  with every other `paths` entry — that is also what lets the registry demos
  import `@/registry/...` unchanged from inside `.blume/`.
- **`pnpm typecheck` is `blume check`**, which regenerates the runtime, syncs
  Astro's types into `.blume/.astro/types.d.ts` (listed in `tsconfig.json`)
  and runs `astro check` over the project. `scripts/verify-dist.mjs` still
  reads one page per layout after the build and asserts the registry JSON, the
  Markdown twins and the head tags are there.

## Design tokens

`packages/cli/registry/html/tokens.css` is the single source of truth
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
   `packages/cli/registry/html/components/<name>.{css,html,js}`.
2. React: `apps/www/registry/bases/newt/ui/<name>.tsx` (cva + `cn` + Tailwind),
   `apps/www/registry/bases/newt/examples/<name>-demo.tsx`,
   and the docs page at `apps/docs/content/docs/components/<name>.mdx`
   (`pnpm --filter docs docs:gen` writes a source-derived starter with API and
   accessibility sections).
3. Vue: `apps/vue/registry/bases/newt/ui/<name>/{Pascal.vue,index.ts}`,
   `apps/vue/registry/bases/newt/examples/PascalDemo.vue`.
4. Add `apps/www/registry/meta/<name>.json` (title, description,
   dependencies, registryDependencies, vueFiles) — this drives the
   generated registry indexes.
5. Add the component to a category in
   `apps/www/registry/registry-categories.ts` — the single taxonomy the
   docs site reads for both frameworks — so it appears in the side nav.
6. Run `node scripts/gen-registry.mjs` and `pnpm --filter docs docs:gen`, then
   `pnpm typecheck && pnpm build`.

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
