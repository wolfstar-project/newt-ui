# Installation, newt/create and Typeset — design spec

Date: 2026-09-08. Status: proposed. Branch: `feat/docs-astro-foundation`.

## 1. Goal

Bring three things over from ui.shadcn.com and shadcn-vue.com, combined into
one version rather than copied from either:

1. **Installation** as a framework picker with icons and three entry paths
   (builder · CLI · existing project), with one sub-page per framework.
2. **newt/create** — the preset builder at `/create`, whose output is a
   command the CLI understands (`newtui init --preset <code>`), not just a CSS
   snippet to paste.
3. **Typeset** — a styling system for rendered markdown and HTML, with a
   builder at `/typeset` and a docs page.

## 2. What the references do (verified 2026-09-08)

|                    | ui.shadcn.com                                                                                                                                                                                                                                                                                                                                                               | shadcn-vue.com                                                                                             | newt/ui takes                                                                                                                                                                                                                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Installation intro | "How to install dependencies and structure your app." + three tabs: **Use shadcn/create · Use the CLI · Existing Project**                                                                                                                                                                                                                                                  | same intro, no create tab                                                                                  | the three tabs, with **newt/create** first                                                                                                                                                                                                                                                     |
| Framework cards    | Next.js, Vite, TanStack Start, Laravel, React Router, Astro — each a card with the framework logo                                                                                                                                                                                                                                                                           | Vite, Nuxt, Astro, Laravel, Manual                                                                         | **Next.js · Vite (React) · Vite (Vue) · Nuxt · Astro · TanStack Start · React Router · Laravel · Manual · HTML & CSS** — the union of both references plus the two bundler-less flavours newt ships. Only the first four get a scaffold template; the rest are documented as existing projects |
| Sub-page shape     | three paths: `init --preset <code> --template next` · `init -t next` (`--monorepo`) · `create-next-app` → tailwind/aliases → `init` → `add button`; package-manager tabs everywhere                                                                                                                                                                                         | numbered steps per framework (create project, tailwind, aliases, `init`, `add`)                            | the three paths as tabs, each a `<Steps>` list, package-manager tabs                                                                                                                                                                                                                           |
| Below the grid     | "For Laravel start with `laravel new`"; link to Manual                                                                                                                                                                                                                                                                                                                      | VS Code extension section                                                                                  | Manual and HTML & CSS are cards rather than footnotes; under the grid, links to `/docs/mcp` and `/docs/skills` in place of an editor extension                                                                                                                                                 |
| Builder            | `/create`: preset (nova, vega, maia, lyra, mira, luma, sera, rhea), base (radix/base/aria), theme colour (20 hues), radius, font, icon library, template; live preview; outputs a preset code, `init --preset <code>`, `apply --preset`, a share URL                                                                                                                        | `/create` with the same shape on Reka                                                                      | newt has one base and one style, so the axes shrink to what a Discord-inspired system actually varies: **brand hue, radius scale, font stack, default theme, direction, target framework**. Output is the same trio: code, `init` command, share URL                                           |
| Typeset            | docs `(root)/typeset.mdx`: Principles · Features · Building Your Typeset · Custom Typesets · Custom Themes · Accessibility and Dark Mode · Responsive Table · Overrides · Opting Out · Streaming · Prior Art. Builder controls: Body/Heading/Mono font, Size, Leading, Flow, Measure; lock per control, shuffle, "Get Code" drawer, "Open in New Tab", URL-persisted params | identical outline; builder in `components/typeset/*` with `useTypeset{SearchParams,Locks,Shuffle,History}` | the three-control model (`--typeset-size`, `--typeset-leading`, `--typeset-flow`) unchanged — it is the right abstraction — fonts and colours resolved to `--newt-*`, previews swapped for **message, embed, channel welcome, docs article**, the surfaces this library renders markdown into  |

## 3. Current state

- `apps/docs/src/content/docs/installation.mdx` is one long page (requirements, init, add, what lands, tokens, per-framework notes, HTML, options) with four sub-pages: `next`, `vite`, `nuxt`, `manual`. No picker, no icons, no three-path structure. Sidebar has an "Installation" group listing the four.
- `/themes` (`apps/docs/src/pages/themes.astro`) already does the brand-hue half of a builder: 5 presets + colour input, rewrites `--newt-brand{,-hover,-active}` live, prints a `:root {}` block to copy. It has no code, no command, no share URL, no radius/font/template. **It is `/create` at a quarter of the size** and should become it.
- CLI `init` accepts `cwd, yes, defaults, skipInstall, css, framework, bundler, registry` (`packages/cli/src/commands/init.ts:58`). No `--template`, no `--preset`. `packages/cli/src/utils/tokens.ts` has `getTokensCssBlock()`; `updaters/update-css.ts` has `updateCss()`. Templates exist for Next (`templates/next-template`) and Nuxt (`templates/nuxt-template`); none for Vite.
- Framework marks for React and Vue exist as inline SVGs in `apps/docs/src/components/site/FrameworkSwitcher.tsx`. No marks for Next, Vite, Nuxt, Astro.
- Tokens: `--newt-radius-{sm,md,lg,full}`, `--newt-font-{sans,mono,display}`, brand trio, `--newt-dir`, light palette under `[data-newt-theme="light"]` — every axis the builder needs already has a token to write.
- Nothing typography-system-like exists. Markdown-rendering surfaces (message content, embed description, channel welcome) style their own text ad hoc.

## 4. Decisions

1. **One Installation index, ten cards, three paths.** `/docs/installation` becomes the picker. Each card is an `.astro` component (`FrameworkCard`) with an in-house SVG mark, title, one-line note, link. The three paths are a `<Tabs>` (`persistKey="install-path"`) at the top of the index **and** of every sub-page, so a reader who picked "Existing project" once sees it everywhere.
2. **Framework marks are the official logos.** The paths come from Simple Icons (CC0), live as data in `apps/docs/src/lib/framework-marks.ts`, and are rendered in `currentColor` so they follow the theme and the light palette. The trademarks stay with the projects that own them; each mark sits beside a link to that project's own guide, which is what nominative use is for, and this is what both references do. `manual` is not a framework and keeps a drawn wrench. Nothing here is a Discord asset — `DISCLAIMER.md` is about Discord's marks, not everyone else's.
3. **`/create` replaces `/themes` outright.** `themes.astro` is deleted with no redirect: the page ships only on this unmerged branch, nothing links to it but the header, and a redirect for a URL that was never public is dead weight. The header entry becomes `Create`. The builder is a React island (state, URL sync, live preview of real registry components) rather than an Astro script — the 200-line vanilla version in `themes.astro` is already at the edge of what a script should carry.
4. **A preset is a code the CLI decodes.** `nt1.<base64url>` of a compact versioned JSON: `{v:1, t:<framework id>, b:"#5865f2", r:"sm"|"md"|"lg", f:"inter"|"system"|"mono-first", m:"dark"|"light", d:"ltr"|"rtl"}`, where `t` is any of the ten card ids. Version-prefixed so a future axis does not break old links. `t` records what the reader was targeting, not what the CLI will scaffold: only `next`, `vite-react`, `vite-vue` and `nuxt` map to a `--template`, and for the others `/create` emits that framework's own scaffold command followed by a bare `init --preset`. Encoding lives in the CLI (`packages/cli/src/utils/preset.ts`) and is **re-implemented** in `apps/docs/src/lib/preset.ts` — the docs may not import CLI source (`AGENTS.md`), so both sides test against the same golden fixture (`packages/cli/src/utils/__fixtures__/presets.json`, copied verbatim to `apps/docs/src/lib/__fixtures__/presets.json`; `apps/docs` gains a Vitest `test` script, and a test on each side asserts the two copies are byte-identical).
5. **CLI grows three things**, all shipped as one `newtui` minor: `init --template <next|vite-react|vite-vue|nuxt>` (scaffold from `templates/*`; the two `vite-*` values run `create-vite` for that framework then continue), `init --preset <code>` (decode, then write the brand/radius/font/theme/dir overrides as a second `:root {}` block after the token block, via `updateCss`), and `apply --preset <code>` (the override step alone, for a project that already ran `init`). `preset decode <code>` prints the JSON, for debugging.
6. **Typeset is a registry item, not a component.** `typeset` ships as `registry:file` targeting `typeset.css` next to the user's global stylesheet, plus thin `Typeset` wrappers in React (`<Typeset preset="docs">`) and Vue that add `class="typeset typeset-<preset>"` — the HTML flavour is the class alone. The CSS keeps shadcn's three-variable model verbatim and resolves everything else to `--newt-*`: fonts to `--newt-font-{sans,display,mono}`, colours to `--newt-text-*`/`--newt-border`, radii to `--newt-radius-*`, code blocks to the same surface `code-block` uses.
7. **`/typeset` builder** mirrors the reference controls (Body · Heading · Mono font, Size · Leading · Flow · Measure, lock, shuffle, URL params, Get Code drawer) with newt's preview surfaces. Fonts offered are the ones the library already names plus system stacks — no font loading from a CDN, in keeping with "no runtime fetch".
8. **Sidebar and header.** Header: `Docs · Components · Blocks · Colours · Create · Typeset · Changelog`. Sidebar Get Started gains `Typeset`; the Installation group lists the ten sub-pages; `Create` gets a Get Started entry pointing at `/docs/create` (a short docs page: what a preset is, the code format, `init --preset`, `apply --preset`) since `/create` itself is an app page with no prose.
9. **Copy rules unchanged.** "Discord-inspired"; framework marks are the frameworks', not Discord's; preview content in the builders uses placeholder names.

## 5. Information architecture

```
/docs/installation                 picker: intro · [newt/create | CLI | Existing project] · 10 cards
/docs/installation/next            Next.js                          template
/docs/installation/vite            Vite (React)                     template   ← existing page split in two
/docs/installation/vite-vue        Vite (Vue)                       template
/docs/installation/nuxt            Nuxt                             template
/docs/installation/astro           Astro (React and Vue islands)               ← new
/docs/installation/tanstack-start  TanStack Start                              ← new
/docs/installation/react-router    React Router                                ← new
/docs/installation/laravel         Laravel (Inertia, React or Vue)             ← new
/docs/installation/manual          Manual
/docs/installation/html            HTML & CSS                                  ← new, moves the `#html` section out of the index
/docs/create                       what a preset is; the code; init/apply --preset
/create                            the builder (React island)
/docs/typeset                      the 11 sections, adapted
/typeset                           the builder (React island)
/themes                            deleted
```

Each framework sub-page:

```
<PathTabs>                          the three paths, persisted
  newt/create   → "Open newt/create, pick <framework>, copy the command" + PmTabs(init --preset … [--template <t>]) + PmTabs(add button)
  CLI           → templated frameworks: PmTabs(init --template <t>) + PmTabs(add button)
                  the rest: that framework's own scaffold command, then PmTabs(init) — the tab
                  says so rather than pretending a template exists
  Existing      → <Steps>: create app · Tailwind (v3/v4 branch) · aliases (tsconfig/vite/nuxt) · init · add · put .newt-root on the wrapper
</PathTabs>
## What init writes       (from today's "What lands in your project", per framework)
## Dark mode / RTL        one line each, linking to the guides
```

## 6. Architecture

```
apps/docs/src/
  components/site/marks/{Next,Vite,Nuxt,Astro,React,Vue,Html,Manual}Mark.astro
  components/mdx/FrameworkCard.astro, FrameworkGrid.astro, PathTabs.astro
  components/create/CreateApp.tsx        island: controls + preview + output
  components/create/{TemplatePicker,HuePicker,RadiusPicker,FontPicker,ThemePicker,DirectionPicker,PresetOutput}.tsx
  components/typeset/TypesetApp.tsx      island: controls + preview + Get Code
  components/typeset/{FontControl,RhythmControl,LockButton,ShuffleButton,PreviewSurface,GetCodeDrawer}.tsx
  lib/preset.ts, lib/preset.test.ts      encode/decode + apply-to-document + toCommand; __fixtures__/presets.json
  lib/typeset.ts                         params schema, defaults, URL sync, CSS emit
  pages/create.astro, pages/typeset.astro
  content/docs/installation/*.mdx (7), create.mdx, typeset.mdx

packages/cli/src/
  utils/preset.ts                        codec + validation (zod), overrides → CSS block
  commands/init.ts                       + template, preset
  commands/apply.ts                      apply --preset
  commands/preset.ts                     preset decode
  utils/preset.test.ts, utils/__fixtures__/presets.json

packages/cli/registry/html/components/typeset.css   the item's file (registry:file → typeset.css)
apps/www/registry/bases/newt/ui/typeset.tsx         thin wrapper
apps/vue/registry/bases/newt/ui/typeset/{Typeset.vue,index.ts}
apps/www/registry/meta/typeset.json                 type registry:file, files: ["typeset.css"], reactFiles/vueFiles for wrappers
```

Preset state flows one way: URL `?p=<code>` → `decode` → island state → (a) `document.documentElement.style` for the live preview, (b) `encode` → command + share URL. Nothing is persisted to `localStorage`; the URL is the persistence, which is what makes it shareable.

## 7. Out of scope

Scaffold templates for Astro, TanStack Start, React Router and Laravel (their cards document the existing-project path only, as shadcn does for Laravel); icon-library axis (newt ships its own glyphs); base/style axes (one base, one style); font CDN loading; a `newtui create` alias (`init --template` is the verb); Typeset streaming demos beyond the static preview; migrating existing message/embed text styles onto Typeset (a follow-up once the item exists).

## 8. Phases

| #   | Phase           | Ships                                                                                                                      | Changeset                 |
| --- | --------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| A   | Installation    | picker, marks, PathTabs, 10 sub-pages, nav                                                                                 | no                        |
| B   | Preset + create | CLI `--template`/`--preset`/`apply`/`preset decode`, codec + fixtures, `/create` island, `/docs/create`, `/themes` deleted | `newtui` minor            |
| C   | Typeset         | `typeset` item (CSS + wrappers), `/typeset` builder, `/docs/typeset`, nav                                                  | `newtui` minor (registry) |

A is independent. B and C are independent of each other; both depend on A only for the header/sidebar entries.

## 9. Success criteria

- `/docs/installation` renders ten cards with marks; every card's target page exists; each sub-page's three path tabs persist across pages (`localStorage` `newt-ui:tabs:install-path`).
- `npx newtui@latest init --template next --preset nt1.…` in an empty directory produces a running Next app whose `globals.css` carries the token block **and** the override block, in that order; `pnpm dev` shows the chosen brand hue.
- `/themes` is gone from `dist` and from the header; nothing in the site links to it.
- `/create` round-trips: change every control → copy code → `newtui preset decode <code>` prints the same values → load `/create?p=<code>` restores every control.
- Codec golden fixture passes in both `packages/cli` and `apps/docs` test suites; a test asserts the two fixture files are byte-identical.
- `npx newtui@latest add typeset` writes `typeset.css` and the wrapper; wrapping a rendered markdown block in `.typeset.typeset-docs` restyles it with no other CSS.
- `/typeset` round-trips its URL params like `/create`; "Get Code" returns `typeset.css` + a preset class + the wrapper snippet for the active framework.
- All gates green: `format:check`, `lint`, `knip`, `typecheck`, `build`, `test`, `verify-dist` (adds `create/index.html`, `typeset/index.html`, the six new installation pages, `r/styles/default/typeset.json`).
