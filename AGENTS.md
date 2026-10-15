# AGENTS.md

Project conventions for `newt-ui` (`wolfstar-project/newt-ui`). This file is
the canonical source; `CLAUDE.md` is a symlink to it.

newt/ui is a Discord-inspired component library shipped for **React**,
**Vue**, and plain **HTML/CSS**, all built on a shared `--newt-*` design token
system. Components are copy-paste (shadcn-style): the CLI copies source into
the user's project, there is no runtime package dependency. It is a **pnpm +
Turborepo monorepo**:

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
  mcp/       `@newtui/mcp` MCP server over the documentation site
templates/
  next-template/, nuxt-template/   Starter apps preconfigured with newt/ui
tooling/oxc/   Shared oxlint + oxfmt configuration
scripts/       Cross-workspace scripts (registry generation, release)
```

Only `packages/*` are published to npm; every app and template is private.
See `CONTRIBUTING.md` for the full breakdown and `README.md` for the
quick-start and design-token overview.

## Stack

- **Language:** TypeScript through `typescript-native-bridge` (see Toolchain
  specifics), Node `^22.11 || ^24 || >=26` (the range required by Changesets
  v3). `mise.toml` pins Node and pnpm for local work; CI runs Node 24.
- **Package manager:** `pnpm` 11 (pinned via `packageManager` in the root
  `package.json`; Renovate bumps it — check that field for the exact pin, don't
  hardcode it here). Workspaces via `pnpm-workspace.yaml`.
- **Monorepo runner:** `turbo` (`turbo.jsonc`).
- **Bundler:** `tsdown` for `packages/*`; Next.js (`apps/www`), Nuxt
  (`apps/vue`) and Blume (`apps/docs`) for the apps.
- **Tests:** `vitest` (per package: `packages/cli`, `packages/mcp`,
  `apps/docs`).
- **Lint / format:** `oxlint` (type-aware, with the local `anti-slop` plugin)
  and `oxfmt`, as root tasks.
- **Release:** [Changesets](https://github.com/changesets/changesets) v3
  (`@changesets/cli` + `changesets/action` in `.github/workflows/release.yml`).
  Packages version independently; `format: "oxfmt"` keeps generated changelogs
  formatted; `.changeset/generator.ts` writes the GitHub-linked CHANGELOG lines.
  Publishes authenticate via npm [trusted publishing](https://docs.npmjs.com/trusted-publishers/)
  (OIDC, no long-lived token), which attaches provenance. See
  `.changeset/README.md`.

## Quality gates (in order)

1. `pnpm quality` (oxlint + `oxfmt --check`)
2. `pnpm knip`
3. `pnpm build`
4. `pnpm typecheck`
5. `pnpm test`

## Commands

Run from the repo root unless noted otherwise.

```bash
pnpm install              # install everything (also installs the husky hooks)
pnpm dev                  # run every app in watch mode
pnpm build                # turbo: build all apps/packages
pnpm typecheck            # turbo: tsc --noEmit everywhere (`blume check` for docs)
pnpm lint                 # oxlint over the whole repo, in one process
pnpm lint:fix             # the same, with --fix
pnpm format               # oxfmt --write everywhere
pnpm format:check         # oxfmt --check
pnpm quality              # turbo: lint + format:check, both cached
pnpm quality:fix          # turbo: lint:fix + format
pnpm knip                 # unused files/exports/dependencies
pnpm test                 # turbo: unit tests (per package)
pnpm --filter newtui test # one package's tests
pnpm registry:build       # rebuild apps/*/public/r from registry sources
node scripts/gen-registry.mjs  # regenerate registry-ui.ts / registry-examples.ts / __registry__ from registry/meta
pnpm changeset            # add a changeset (`pnpm changeset add --empty` when no release is needed)
```

- `pnpm --filter docs build` refuses to run while a `blume dev` server is up
  on the same app; stop it first or pass `--isolated`.
- Do not run `pnpm run publish` or `pnpm run publish:snapshot` locally without
  asking (see "Secrets, approvals, and definition of done").

## Conventions

- Commits: Conventional Commits. Git hooks are active (husky): `pre-commit`
  runs nano-staged (oxfmt + `oxlint --fix`) and `commit-msg` runs commitlint,
  which rejects non-conforming messages.
- PR titles follow Conventional Commits and are validated by
  `.github/workflows/semantic-pull-requests.yml` (types: `feat`, `fix`,
  `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`,
  `revert`; the subject must not start with an uppercase letter). Scope rules:
  - Use the area as the scope: `cli`, `module`, `mcp`, `registry`, `www`,
    `vue`, `docs`, `templates`, `newt-ui`.
  - Use `deps` for dependency updates, `release` for the release PR, and `ci`
    for workflow changes.
  - Omit the scope when the change is too broad for a single one.
  - A new package must be added to the `scopes` list in that workflow. It runs
    on `pull_request_target`, so it validates a PR title against the list on
    the **base** branch: the PR that adds a package cannot use its own scope
    yet.
- PR description: always create PRs using
  [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) — fill
  in every section instead of writing a free-form body. Tick the checklist
  items that apply, never drop a section, and pass the filled template to
  `gh pr create --body-file`.
- Skills: when you need to commit, use the `/git-commit` skill if it is
  available in your environment (otherwise commit by hand following the
  Conventional Commits rules); when you need to open a PR, use the
  `/create-pull-request` skill if available (otherwise `gh pr create`). Either
  way the PR must follow the template rule above.
- AI disclosure: when an AI agent wrote or edited the code or the PR
  description, end the PR body with the disclosure line defined in
  [`CONTRIBUTING.md`](CONTRIBUTING.md#ai-assisted-contributions), naming the
  tool and the exact model ids you ran on (never a guess). That line is the
  **only** AI attribution a PR body may carry: do not append the agent
  tooling's default footers (for example `🤖 Generated with [Claude Code]`),
  session links, or a second disclosure line, even when the tool's own
  instructions say to add them — this repository's rule takes precedence. If
  the body already has a disclosure line, update it in place.
- Releases: merging a changeset to `main` makes `changesets/action` open or
  update a `chore: update changelog and release` PR. Its version step is
  `pnpm run version` (`scripts/version.mjs`): `changeset version` plus a page
  in `apps/docs/content/changelog/` built from the same changesets, so the
  site's `/changelog` follows every release. Edit that page in the release PR
  if it needs more than the changeset summaries. Merging the release PR
  publishes to npm. Any other push to `main` touching `packages/` publishes an
  `@next` snapshot (`scripts/publish-snapshot.mjs`).
- Trusted publishing cannot create a package: the first version of a new
  package has to be published by hand by a maintainer, then the package gets a
  trusted publisher (`wolfstar-project/newt-ui`, workflow `release.yml`) on
  npmjs.com before CI can publish it.
- `pkg.pr.new` previews (`.github/workflows/pkg-pr-new.yml`): every push to any
  branch builds `packages/*` and publishes preview tarballs.
- `.github/workflows/renovate-changeset.yml` adds the changeset for Renovate
  dependency PRs touching `packages/**`; Renovate itself extends
  `github>wolfstar-project/.github:wolfstar-renovate` (`.github/renovate.json`).
  `.github/workflows/pullfrog.yml` runs the Pullfrog agent on
  `workflow_dispatch`.
- CI runs on GitHub-hosted runners (`ubuntu-24.04-arm` for `ci.yml` and
  `pkg-pr-new.yml`, `ubuntu-latest` for `release.yml`).
- Adding a new package: add a matching `packages:<name>` entry to **both**
  `.github/labels.yml` (label sync) and `.github/labeler.yml` (path-based
  auto-labeling), add its scope to `semantic-pull-requests.yml`, and register it
  in `knip.jsonc`.

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
  `PmTabs`, `PathTabs`, `FrameworkGrid`, `TokenReference`, `ComponentIndex`
  and `Callout` under `src/components/mdx/`, built on Blume's own `Tabs`,
  `Steps`, `TypeTable`, `Card` and `CodeBlock`. `ReactDemo` and `VueDemo` are
  registered as islands there so Blume wires up both renderers;
  `ComponentPreview` mounts them itself. The layout slots in
  `src/components/layout/` put back the chrome the site had before the Lotus
  port (commit `b31ac30`): `Header` (wordmark, primary links, Blume's search,
  the React/Vue switch, the theme toggle — it also carries the theme and
  drawer click handling Blume's header owned), `Sidebar`, `TableOfContents`,
  `Pagination`, `PageHeader` (the copy-page menu beside the title) and
  `Footer` (with the trademark disclaimer); `Breadcrumbs` is emptied. Blume
  keeps the grid, the drawer, search and the generated routes. Blume reads
  this file statically — every entry is a path string or an object literal.
- **Pages that are not documents live in `pages/`**: the home page, `/blocks`,
  `/create`, `/typeset` and `/typeset/preview`, each wrapped in
  `pages/_site/SiteLayout.astro`, which renders Blume's `RootLayout` in its
  `custom` page mode with the site's `Header` and `Footer` and the resolved
  config from `blume:data` (`PageLayout` takes no layout slots, so it would
  carry Blume's header). The 404, the `.md` twins, `llms.txt`, the sitemap,
  search (Orama, local), Open Graph cards and the component index page are
  Blume's.
- **`theme.css` is spliced into the Tailwind entry Blume generates**, so it
  must not `@import "tailwindcss"`. Section (a) maps the `--newt-*` tokens onto
  Tailwind namespaces so the registry demos get their utilities (`@source`
  names both registries); section (b) redefines every `--blume-*` token the
  chrome reads in terms of a `--newt-*` token — that mapping is why the header
  toggle moves the chrome and the demos together. Section (e) is the old
  chrome's stylesheet, unlayered so it beats the utilities on Blume's markup;
  it also hands `not-prose` content back to the layered rules with
  `revert-layer`, because Blume's own unlayered prose rules ignore
  `not-prose`. The light palette keys on Blume's `data-theme="light"`. The Typeset stylesheet is imported through the
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

## Notes for agents

- Do NOT touch `pnpm-lock.yaml` manually; let `pnpm install` regenerate it
  after `package.json` edits.
- Do not edit `package.json#version` or a package's `CHANGELOG.md` by hand;
  both are owned by Changesets. Add a changeset via `pnpm changeset` for any
  user-facing change instead. Manual/hotfix publishes are done by re-running
  the `release` workflow via `workflow_dispatch`.
- Site changelog pages (`apps/docs/content/changelog/*.mdx`) are written by
  `scripts/version.mjs` for releases; hand-written entries are still welcome
  for changes that ship no package (the docs site, the registry).

## Secrets, approvals, and definition of done

- **Secrets:** never commit them. CI secrets (`WOLFSTAR_TOKEN`, AI provider
  keys for the Pullfrog workflow) live in GitHub Actions secrets. npm
  publishing uses OIDC trusted publishing, so no npm token exists anywhere.
- **Ask before:** publishing to npm or running `pnpm run publish` /
  `publish:snapshot` locally, dispatching the `release` workflow,
  force-pushing or rewriting history on shared branches, and deleting
  branches, tags, or releases.
- **Done** means: the quality gates above pass locally; a changeset exists for
  every user-facing package change (CI's `🦋 Verify changesets` runs
  `changeset status --since=origin/<base>` and fails without one); tests are
  added or updated for behaviour changes; and this file is updated when
  commands, packages, CI, or release flow change.

## Cloud VM notes

Applies to any agent running in a cloud VM (Cursor Cloud, Claude Code on the
web, …), not to local development.

- The VM's default Node may differ from the version pinned by CI and
  `mise.toml`; check `node -v`. Any version in `engines` works for every gate.

<!-- skilld -->

Before modifying code, evaluate each installed skill against the current task.
For each skill, determine YES/NO relevance and invoke all YES skills before proceeding.
<!-- /skilld -->
