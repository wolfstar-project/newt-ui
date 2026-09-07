# newt/ui docs redesign — design spec

Date: 2026-09-07. Status: approved scope, awaiting implementation.

## 1. Goal

Rebuild the documentation site so it matches the information architecture,
page anatomy and tooling of ui.shadcn.com and shadcn-vue.com, while keeping
newt/ui's two defining traits: one site for React **and** Vue, and the
Discord-inspired `--newt-*` token system as the visual language of the site
itself.

The redesign adds the sections those two sites ship and newt/ui lacks:
MCP server, Skills, llms.txt / copy-page-as-markdown, Changelog, CLI
reference, components.json, Registry authoring, RTL, Forms guides, Blocks,
Colors, Themes and a light mode toggle.

## 2. Current state (verified 2026-09-07)

| Area                            | Reality                                                                                                                                                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/docs`                     | Vite 8 + React 19 SPA, hand-rolled router (`src/site/router.tsx`), Vue demos as islands (`src/site/VueIsland.tsx`). Zero markdown/MDX, all prose in JSX.                                                                |
| Pages                           | `/`, `/docs/installation`, `/docs/using-with-ai`, `/docs/components/:name` (55 generated), 404.                                                                                                                         |
| Missing                         | Header, search, TOC, theme toggle, SSG, `.md` routes, changelog, CLI/theming/registry pages, blocks, colors, themes.                                                                                                    |
| Registry consumption            | Vite aliases `@/registry` → `apps/www/registry`, `@/lib/registry` → `apps/vue/app/lib/registry`; four relative `import.meta.glob` calls; Tailwind `@source` on both registries.                                         |
| Deployment contract             | `dist/r/**` and `dist/vue/r/**` (copied by `scripts/bundle-registry.mjs`) **are** the registry CDN behind `https://newtui.dev/r` and `/vue/r`. `dist/404.html` is the SPA fallback.                                     |
| CLI (`packages/newtui`, v2.0.0) | `init`, `add`, `list`, `diff`. `mri` arg parsing, `@clack/prompts`, `zod ^3.24`, built with `tsdown`. No tests, no MCP, no `info`/`search`/`view`/`migrate`.                                                            |
| Registry index                  | `public/r/index.json` + `public/r/styles/default/<name>.json` (items and `<name>-demo` examples). `registry.react.json` already uses the shadcn `registry.json` schema.                                                 |
| Tokens                          | `packages/newtui/registry/html/tokens.css` is the source; `registry-tokens.ts` / `registry-themes.ts` project them for Tailwind v3 + v4 and carry an unused light palette (`.newt-light`, `[data-newt-theme="light"]`). |
| RTL                             | No logical properties. Physical-direction usages: 25 in HTML/CSS, 29 in React, 29 in Vue. No directional icons found by name.                                                                                           |
| Forms                           | `form-fields` (Field, Label, Input, Textarea, Select, FieldHelp, Switch, Checkbox) is presentational; no validation library anywhere.                                                                                   |
| Skills                          | 5 repo skills in `.skills/*/SKILL.md`, symlinked into `.claude/skills/`; not published for `npx skills add`.                                                                                                            |
| Changelog                       | Root `CHANGELOG.md` stale (43 components listed, registry has 55); one pending changeset describes the PR #12 rework.                                                                                                   |

## 3. Decisions

1. **Stack: Astro** (7.3) with `@astrojs/mdx`, `@astrojs/react`, `@astrojs/vue`,
   Tailwind v4 via `@tailwindcss/vite`, `astro-expressive-code` for code
   blocks, `astro-pagefind` for search, `nanostores` for the two pieces of
   shared client state (framework, theme). Static output. Rationale: native
   React + Vue islands in one page, content collections with MDX, trivial
   `.md` / `llms.txt` endpoints, SSG for SEO, `public/`-style static copy of
   the registry. Fumadocs and Nuxt Content were rejected because each makes
   the other framework a second-class island.
2. **Replace `apps/docs` in place.** Package name `docs`, turbo task
   `docs#build`, and the `bundle-registry.mjs` post-build step stay, so the
   deployment contract (`/r/**`, `/vue/r/**`, `/404.html`) is untouched.
3. **One site, one framework switcher.** React/Vue is a persisted client
   preference (`localStorage` `newt-ui:framework`, nanostore `$framework`),
   shown in the header. Every demo, install snippet and usage block reacts
   to it. It is not in the URL: one canonical URL per page keeps search,
   `.md` twins and llms.txt simple.
4. **Light mode ships.** `[data-newt-theme="light"]` on `<html>`, persisted
   as `newt-ui:theme`, pre-hydration inline script to avoid flash. The site
   chrome is built from `--newt-*` tokens, so the toggle flips the whole site
   and every demo.
5. **Content is MDX, one file per page**, including one per component. Page
   chrome (preview, installation tabs, usage) comes from MDX components that
   read `registry/meta/<name>.json`, so component pages stay thin and the
   registry stays the source of truth. Prose, examples and API tables are
   hand-written in the MDX.
6. **MCP server lives in the `newtui` CLI** (`newtui mcp`, `newtui mcp init
--client <name>`), mirroring `npx shadcn@latest mcp`. Tools mirror
   shadcn's names so agents that know shadcn need no relearning.
7. **Skills are published from `skills/newt-ui/`** at the repo root, the
   layout `npx skills add wolfstar-project/newt-ui` scans. The five internal
   `.skills/*` stay as contributor skills; the published skill is for
   consumers.
8. **RTL is done at the source**: all three component layers move to CSS
   logical properties, so the registry is RTL-safe without an install-time
   transform. `newtui migrate rtl` exists only to fix components users
   installed before the change. A `direction` provider (React context, Vue
   provide/inject, plain `dir` attribute in HTML) is the documented way to
   set direction.
9. **Forms are guides, not a wrapper component.** Three guides
   (react-hook-form, TanStack Form, vee-validate) on top of `form-fields`,
   which gains an invalid state. No `<Form>` abstraction, matching shadcn's
   current direction.
10. **Blocks are `registry:block` items** built from existing components,
    both frameworks, listed in a `/blocks` gallery and installable with
    `newtui add <block>`.
11. **Changelog is a content collection** (`YYYY-MM-topic.mdx`), seeded from
    the existing changelog and pending changeset, and updated as part of the
    release runbook in `.changeset/README.md`.
12. **Copy conventions** from `DISCLAIMER.md` apply to every new page:
    "Discord-inspired", no Discord wordmarks or assets.

## 4. Information architecture

### Header

`Docs · Components · Blocks · Colors · Themes · Changelog` · search (⌘K) ·
framework switcher (React | Vue) · theme toggle · GitHub.

### Sidebar (docs)

```
Get Started
  Introduction                 /docs
  Installation                 /docs/installation
  components.json              /docs/components-json
  Theming                      /docs/theming
  Dark Mode                    /docs/dark-mode
  RTL                          /docs/rtl
  CLI                          /docs/cli
  MCP Server                   /docs/mcp
  Skills                       /docs/skills
  JavaScript                   /docs/javascript
  HTML & CSS (legacy)          /docs/html-css
  Changelog                    /docs/changelog
  llms.txt                     /llms.txt

Design
  Design guide                 /docs/design           (from AGENT_GUIDE.md §1-4, §6)
  Accessibility                /docs/accessibility    (AGENT_GUIDE.md §5)
  Trademark & attribution      /docs/trademark        (DISCLAIMER.md)

Installation
  Next.js  /docs/installation/next     Vite  /docs/installation/vite
  Nuxt     /docs/installation/nuxt     Manual /docs/installation/manual
  HTML     /docs/installation/html

Dark Mode
  Next.js  /docs/dark-mode/next   Vite  /docs/dark-mode/vite   Nuxt  /docs/dark-mode/nuxt

Forms
  Overview            /docs/forms
  react-hook-form     /docs/forms/react-hook-form     (React)
  TanStack Form       /docs/forms/tanstack-form       (React + Vue)
  vee-validate        /docs/forms/vee-validate        (Vue)

Registry
  Introduction        /docs/registry
  Getting started     /docs/registry/getting-started
  registry.json       /docs/registry/registry-json
  registry-item.json  /docs/registry/registry-item-json
  Examples            /docs/registry/examples
  MCP                 /docs/registry/mcp

Components (one group per registry category, registry order)
  Actions · Feedback · Identity & presence · Messaging · Forms & data · Utilities
  /docs/components/<name>
```

Top-level, non-docs routes: `/`, `/docs/components` (index with "New" and
"All"), `/blocks`, `/blocks/<name>`, `/colors`, `/themes`, `/404`.

Machine routes: `/docs/<slug>.md` for every docs page, `/llms.txt`
(curated index), `/llms-full.txt` (all page bodies), `/r/**`, `/vue/r/**`.

### Component page anatomy

1. Title, description, optional `links.doc` / `links.api` badges, "New" dot.
2. `<ComponentPreview name="button">`: Preview | Code tabs. Preview renders
   the React or Vue demo island depending on `$framework`; Code shows the
   demo's own source (React `tsx` or Vue `vue`), pre-rendered for both.
3. `## Installation`: CLI | Manual tabs. CLI: package-manager tabs around
   `npx newtui@latest add <name>`. Manual: npm dependencies, registry
   dependencies (links), source of every file for the active framework.
4. `## Usage`: import + minimal snippet for the active framework.
5. `## Examples`: `###` per example, each a `<ComponentPreview name="<name>-<variant>">`.
6. `## API reference`: props table per exported part.
7. `## Accessibility` where relevant.
8. `## Tokens`: the `--newt-*` variables the component reads.
9. Right rail: TOC, "Copy page" dropdown (Copy markdown · View as Markdown ·
   Open in Claude · Open in ChatGPT). Bottom: labelled prev/next pager.

### Changelog entry anatomy

Frontmatter `title`, `description`, `date`; a bold lede; `##` per feature;
embedded `<ComponentPreview>` where a feature is visual. Index lists entries
newest first with dates. No pager on changelog pages.

## 5. Architecture

```
apps/docs/
  astro.config.ts              integrations: mdx, react, vue, expressiveCode, pagefind, sitemap
                               vite: tailwindcss(), resolve.alias (3 aliases as today)
  src/content.config.ts        collections: docs (mdx), changelog (mdx), blocks (json → meta)
  src/content/docs/**/*.mdx    page prose (see §4 for the tree)
  src/content/changelog/*.mdx  YYYY-MM-topic.mdx
  src/pages/
    index.astro                home
    docs/[...slug].astro       getStaticPaths over `docs`
    docs/[...slug].md.ts       raw body twin
    docs/components/index.astro
    docs/changelog/index.astro
    blocks/index.astro, blocks/[name].astro
    colors.astro, themes.astro, 404.astro
    llms.txt.ts, llms-full.txt.ts
  src/layouts/Base.astro, Docs.astro
  src/components/
    site/   Header, Sidebar, Toc, Pager, Footer, Search (pagefind), ThemeToggle,
            FrameworkSwitcher (React island), CopyPage
    mdx/    ComponentPreview.astro, Installation.astro, Usage.astro, Steps,
            Callout, CodeTabs, PmTabs, PropsTable, TokensTable
    demo/   ReactDemo.tsx (island, client:only="react"), VueDemo.vue (island,
            client:only="vue") — each subscribes to $framework and renders
            only when active
  src/stores/framework.ts, theme.ts     nanostores + localStorage persistence
  src/lib/registry.ts          reads meta/*.json, categories, root classes,
                               demo globs, `?raw` sources (same globs as today)
  src/styles/site.css          tokens bridge (kept), chrome restyled to shadcn layout
  scripts/bundle-registry.mjs  kept: copies /r and /vue/r into dist
  scripts/gen-component-docs.mjs  creates missing docs/components/<name>.mdx stubs
```

Data flow: `apps/www/registry/meta/*.json` + `registry-categories.ts` →
`src/lib/registry.ts` → sidebar groups, component MDX components, blocks
gallery, llms.txt. Docs never import from `packages/*` source.

Client state: two nanostores (`$framework`, `$theme`) persisted to
`localStorage`; an inline `<script is:inline>` in `Base.astro` applies both
attributes (`data-framework`, `data-newt-theme`) to `<html>` before paint.
Framework-dependent server-rendered markup (code blocks, install snippets)
is emitted for both frameworks and toggled with CSS
`html[data-framework="vue"] [data-framework="react"] { display: none }`, so
switching needs no re-render.

### CLI additions (`packages/newtui`)

| Command                                                            | Purpose                                                                                                           |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `newtui info [--json]`                                             | framework, bundler, Tailwind version, aliases, installed components, registry URL. Consumed by the skill and MCP. |
| `newtui search [query] [--json]`                                   | `list` with a query filter (alias kept).                                                                          |
| `newtui view <name...>`                                            | print registry item files without installing.                                                                     |
| `newtui mcp`                                                       | stdio MCP server.                                                                                                 |
| `newtui mcp init --client claude\|cursor\|vscode\|codex\|opencode` | write client config.                                                                                              |
| `newtui migrate rtl [--dry-run]`                                   | rewrite physical Tailwind classes to logical in installed `ui/` files.                                            |

MCP tools (names mirror shadcn): `get_project_registries`,
`list_items_in_registries`, `search_items_in_registries`,
`view_items_in_registries`, `get_item_examples_from_registries`,
`get_add_command_for_items`, `get_audit_checklist`, plus newt-specific
`get_design_tokens`. Prompts: `install-component`, `build-with-newt`.

### RTL

- `tokens.css`: `--newt-dir: 1; [dir="rtl"] { --newt-dir: -1 }`. Any
  `translateX(N)` becomes `translateX(calc(var(--newt-dir) * N))`.
- HTML/CSS: `margin-left` → `margin-inline-start`, `left:` → `inset-inline-start`,
  `border-left` → `border-inline-start`, `text-align: left` → `start`,
  corner radii → `border-start-start-radius` etc.
- React/Vue Tailwind: `ml/mr/pl/pr/left/right/border-l/border-r/rounded-l|r|tl|tr|bl|br/text-left|right`
  → `ms/me/ps/pe/start/end/border-s/border-e/rounded-s|e|ss|se|es|ee/text-start|end`.
  `space-x-*` → `gap-*` (v3 `space-x` is not RTL-safe).
- New `direction` item: React `DirectionProvider` + `useDirection`; Vue
  `DirectionProvider.vue` + `useDirection`; HTML doc explains `dir`.

### Blocks

`apps/www/registry/default/block/<name>/` (React) and
`apps/vue/app/lib/registry/default/block/<PascalName>/` (Vue), meta
`registry/meta/<name>.json` with `"type": "registry:block"`. Initial set:
`chat-window` (channel-header + message-list + message-composer),
`server-sidebar` (server-banner + member-list + voice-channel),
`command-panel` (slash-command-suggestions + bot-command-card).

## 6. Out of scope

Charts, Typeset, Directory (third-party registries), Figma kits, "Open in
v0", Create/preset builder, per-page style variants, i18n of the docs, a
`newtui build` for third-party registries, Playwright visual regression.

## 7. Decomposition and order

Each phase is one PR, independently shippable, with its own plan.

| #   | Phase                 | Ships                                                                                                                                                          | Changeset                 |
| --- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| 1   | Astro foundation      | New `apps/docs` with layout, collections, component pages, search, theme + framework toggles, `.md` + llms.txt, existing three pages migrated, old SPA deleted | no                        |
| 2   | Docs content          | Get Started, Design, Installation, Dark Mode, Registry, Changelog collection, Colors page, component examples + API tables                                     | no                        |
| 3   | CLI + MCP             | `info`, `search`, `view`, `mcp`, `mcp init`, vitest setup, MCP docs page, `/docs/registry/mcp`                                                                 | `newtui` minor            |
| 4   | Skills                | `skills/newt-ui/`, Skills page, `npx skills add` verified                                                                                                      | no                        |
| 5   | RTL                   | logical properties in 3 layers, `--newt-dir`, `direction` item, `migrate rtl`, RTL pages                                                                       | `newtui` minor            |
| 6   | Forms, Blocks, Themes | `form-fields` invalid state, 3 guides + demos, 3 blocks + gallery, `/themes`                                                                                   | `newtui` minor (registry) |

Phase 1 is fully planned in
`docs/superpowers/plans/2026-09-07-docs-redesign-phase-1-astro-foundation.md`.
Phases 2–6 are outlined in
`docs/superpowers/plans/2026-09-07-docs-redesign-roadmap.md` and each gets a
detailed plan when its predecessor lands.

## 8. Success criteria

- `pnpm build` produces `apps/docs/dist` with `index.html`, `404.html`,
  `r/index.json`, `vue/r/index.json`, `docs/components/button/index.html`,
  `docs/components/button.md`, `llms.txt`, `pagefind/`.
- Every one of the 55 components renders both demos and both code tabs.
- Lighthouse accessibility ≥ 95 on a component page in both themes.
- `pnpm format:check && pnpm lint && pnpm knip && pnpm typecheck` clean.
- `npx newtui@latest mcp` answers `list_items_in_registries` against
  `https://newtui.dev/r` from Claude Code.
- `npx skills add wolfstar-project/newt-ui` installs the skill.
- Every component renders correctly under `<html dir="rtl">` (manual
  checklist per component in the phase 5 plan).
