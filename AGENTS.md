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
  docs/   THE documentation site (Astro + MDX, React and Vue islands). One
          site for both frameworks: a React/Vue switcher picks which registry
          renders each demo. Content is `src/content/docs/**/*.mdx`; it reads
          `apps/www/registry` and `apps/vue/registry` directly through
          path aliases and bundles both built registries into its own `dist/`.
          The chrome is `@prosefly/astro-theme-lotus` — see the docs site
          section below before changing a layout, a route or a style.
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
  workspace declares a `lint` script. `pnpm lint` runs `astro sync` first —
  the docs app's generated types are what the type-aware rules resolve
  `astro:content` and `import.meta.glob` through, and without them the docs
  app reports about twenty errors that are not there.
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

`apps/docs` runs on `@prosefly/astro-theme-lotus`, pinned to an exact version
and patched. What that means in practice:

- **The theme owns the chrome**, so the app does not: header, sidebar, table of
  contents, search dialog, prev/next and footer all come from the theme, and
  the app configures them through `lotus({...})` in `astro.config.ts`. The
  sidebar is not hand-written — `src/lib/lotus-nav.ts` turns `NAV` from
  `src/lib/nav.ts` into the theme's `docsNav`, so a new page is added there.
- **Five slots are overridden** in `src/components/lotus/`: `ThemeSwitch`
  (the two-state toggle and the framework switcher), `PageActions` (the copy
  menu with the MCP and IDE deep links), `SiteBrand`, `FooterLinks` (which is
  where the trademark disclaimer lives) and `Assistant` (the site's scripts).
  Reach for a slot before reaching for the patch.
- **Every route builds its own `<head>`** through `src/lib/lotus-head.ts`. The
  theme emits a title, a description and the favicons and stops, so canonical,
  Open Graph, Twitter, the markdown twin link and the whole PWA head are the
  app's to pass. `astro-takumi` refuses to render a card without `og:title`,
  `og:url` and `og:type`, so forgetting fails the build; forgetting the
  manifest does not, which is why `scripts/verify-dist.mjs` reads one page per
  layout and asserts the tags are there.
- **`patches/@prosefly__astro-theme-lotus@0.8.0.patch` has three hunks**: it
  empties the three routes the theme injects unconditionally (they collide
  with this app's own `/404`, `/docs/[...slug]` and `/docs/[...slug].md`),
  drops the trailing slash the theme adds to every link (`trailingSlash` here
  is `never`), and loads `pagefind` outside Vite's module runner. Reapply it on
  every theme bump, and if it grows past three hunks, vendor the theme instead.
- **`markdown.processor` is an empty `unified({})` and has to stay one.**
  Expressive Code configures itself against whatever processor exists at its
  own setup hook, and the theme replaces a `satteri()` processor without
  carrying its plugins over — which silently turns all 107 files' fenced blocks
  into bare `<pre>`. Explicit heading anchors are `{#id}`, read by
  `mdast-heading-id`, and must not be escaped.
- **`src/styles/lotus.css` is read off a path**, not imported: the theme
  inlines it into `.astro/lotus/styles.css`, which already says
  `@import "tailwindcss"`, so this file must not. Section (c2) maps every
  `--lotus-*` the theme reads onto the `--newt-*` the components read — that
  mapping is why the theme toggle moves the chrome and the demos together.
  Section (e) is deliberately outside every cascade layer: Tailwind Typography
  lands in `@layer utilities` and a layered rule loses to it before
  specificity is even consulted.
- **The build needs a raised heap and three Iconify packages.**
  `NODE_OPTIONS=--max-old-space-size=4096` is in the build script because
  `astro-takumi` holds all 118 pages while it rasterises the cards;
  `@iconify-json/{lucide,simple-icons,vscode-icons}` are installed because the
  theme's icon middleware otherwise fetches `api.iconify.design` at build time
  and the build stops working offline. Both are listed in `knip.jsonc` as
  untraceable, along with `lotus.css` itself.

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
   and the docs page at `apps/docs/src/content/docs/components/<name>.mdx`
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
