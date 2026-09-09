# Installation, newt/create and Typeset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Turn `/docs/installation` into a framework picker with icons and three entry paths, add a `/create` preset builder whose output the CLI decodes, and ship Typeset — a token-based styling system for rendered markdown with its own builder and docs.

**Architecture:** Installation is content plus three small Astro components (marks, cards, path tabs). newt/create and Typeset are React islands on app pages, each backed by a tiny pure library (`lib/preset.ts`, `lib/typeset.ts`) that owns URL-param parsing and code emission. The preset codec is duplicated in `packages/cli` and locked to the docs copy by a shared golden fixture; the CLI gains `init --template/--preset`, `apply --preset` and `preset decode`. Typeset is a `registry:file` item (`typeset.css`) plus thin React/Vue wrappers.

**Tech Stack:** Astro 7 + MDX, React 19 islands, nanostores, Tailwind v4 in docs, `newtui` CLI (TypeScript, zod 3, Vitest), registry meta JSON + `scripts/gen-registry.mjs`, Playwright headless for page checks.

**Spec:** `docs/superpowers/specs/2026-09-08-installation-create-typeset-design.md`

## Global Constraints

- Docs never import CLI source. Shared behaviour is duplicated and pinned by fixtures, not by a workspace dependency.
- Every colour, radius and font the builders emit must be a `--newt-*` token override. No hex literal that already exists as a token.
- Framework marks are the official logos from Simple Icons (CC0), rendered in `currentColor`. No Discord assets. `manual` keeps a drawn glyph because it is not a framework.
- Copy says "Discord-inspired". Preview content uses placeholder names.
- `oxlint` anti-slop rules apply: no `as` without a `// SAFETY:` comment, no `Record<string, unknown>`, parse with zod instead of casting, `toSorted` over `sort`.
- Gates before each commit: `pnpm format:check`, `pnpm lint`, `pnpm knip`, `pnpm typecheck`, `pnpm --filter cli test`, `pnpm build`, `node apps/docs/scripts/verify-dist.mjs`.
- One commit per task group, English conventional-commit message, no mixed unrelated changes. The working tree currently holds other people's uncommitted files — stage by path, never `git add -A`.

## Status: shipped, 2026-09-09

All three phases are on `feat/docs-astro-foundation`. Where the build differs
from the plan, it is because the plan proposed a second copy of something the
repository already had:

- **One `FrameworkMark.astro`, not eleven files.** The paths live in
  `apps/docs/src/lib/framework-marks.ts` and are rendered by an Astro component
  and a React one, because newt/create needs the same set. A `.ts` index
  importing eleven `.astro` files would not have typechecked anyway.
- **The marks are the real logos, not hand-drawn glyphs.** The first pass drew
  them; the reader could not tell TanStack from a stack of pancakes. They now
  come from Simple Icons, which is CC0, and only `manual` is still drawn.
- **`FrameworkCard` folded into `FrameworkGrid`.** A card is four lines and is
  only ever rendered by the grid.
- **`PathTabs` generates the two CLI paths** from `INSTALL_TARGETS` instead of
  taking three slots, so the ten pages carry only the step list that differs.
- **No `installation/html.mdx`.** `/docs/html-css` already documents that
  flavour in full; the card links there rather than duplicating it.
- **`init --template` runs each framework's own creator** rather than copying
  `templates/*` into the published package — four fewer starters to keep
  current, and it is what shadcn does.
- **Typeset ships as an ordinary registry item**, not `registry:file`: its meta
  declares `cssFile`, and `gen-registry.mjs` carries the canonical HTML-flavour
  stylesheet into the item's `css`, which `add` already knows how to append.
- **The docs gained `zod` and `vitest`.** The anti-slop rules want payloads
  parsed at the boundary rather than inspected, so the docs codec declares the
  same schema the CLI does.
- **The fixture pins the CSS too.** It carries a `css` field produced by
  `newtui preset css`, so the docs renderer is checked against the CLI's output
  rather than against itself.

One bug surfaced during the work and was fixed on its own commit: groups
sharing a `persistKey` were pushing their selection onto every sibling on the
page, so picking npm under one command rewrote every other code block.

## Decisions (confirmed by the user, 2026-09-08)

1. **`/themes` is deleted, not redirected.** `/create` takes its place; the page only ever existed on this unmerged branch, so no redirect is added.
2. **Ten framework cards**, the union of both references: Next.js, Vite (React), Vite (Vue), Nuxt, Astro, TanStack Start, React Router, Laravel, Manual, HTML & CSS. Only the first four have a scaffold template; the others document the existing-project path, as shadcn does for Laravel.
3. **Preset axes as proposed:** brand hue, radius, font, default theme, direction, target framework. No base, style or icon-library axis.
4. **Typeset ships as a registry item** (`newtui add typeset`), not as part of `init`.

---

## Phase A — Installation picker

### Task A1: Framework marks

**Files:**

- Create: `apps/docs/src/components/site/marks/{NextMark,ViteMark,NuxtMark,AstroMark,TanstackMark,ReactRouterMark,LaravelMark,ReactMark,VueMark,HtmlMark,ManualMark}.astro`
- Create: `apps/docs/src/components/site/marks/index.ts` (name → component map, `satisfies Record<FrameworkId, …>`)
- Modify: `apps/docs/src/components/site/FrameworkSwitcher.tsx` (keep its two inline SVGs; they are React elements and the marks folder is Astro — do not cross-import, just keep the paths identical)
- Modify: `apps/docs/src/styles/site.css` (`.framework-mark` size + hue classes already exist; add `.framework-card-mark`)

- [x] Draw each mark as a 24×24 `viewBox` with `fill="none" stroke="currentColor"` or a single `currentColor` fill. Keep every path under ~6 commands; these are glyphs, not logos.
- [x] `index.ts` exports `FRAMEWORK_IDS = ["next","vite-react","vite-vue","nuxt","astro","tanstack-start","react-router","laravel","manual","html"] as const` and `MARKS`.
- [x] Render all eleven on a scratch page, screenshot with Playwright in both themes, check contrast on `--newt-bg-primary` and the light palette.
- [x] Laravel's mark is the two nested angular strokes of its shape language, not its wordmark; TanStack's is the stacked chevrons; React Router's is the split path. Glyphs, never logo files.

### Task A2: `FrameworkCard` and `FrameworkGrid`

**Files:**

- Create: `apps/docs/src/components/mdx/FrameworkCard.astro` — props `id`, `title`, `note`, `href`; renders `<a class="framework-card">` with the mark, title, note.
- Create: `apps/docs/src/components/mdx/FrameworkGrid.astro` — takes `items: readonly {id,title,note,href}[]`, 3-up grid on desktop, 2-up tablet, 1-up mobile.
- Modify: `apps/docs/src/styles/site.css` — `.framework-grid`, `.framework-card` (border `--newt-border`, radius `--newt-radius-lg`, hover lifts background to `--newt-bg-secondary`, focus ring `--newt-brand`, `:where([dir="rtl"])` needs nothing because the layout is grid).
- Modify: `apps/docs/src/lib/mdx-components.ts` (or wherever MDX components are registered) to expose both.

- [x] Card is the whole link (no nested interactive), `aria-describedby` on the note.
- [x] Grid reads its data from a single `INSTALL_TARGETS` constant in `apps/docs/src/lib/install-targets.ts` (`{ id, title, note, href, template?: TemplateId }`) so nav, grid and the CLI-path copy stay in step.
- [x] Ten cards land as 3-up on desktop with the last row of one centred left, not stretched.

### Task A3: `PathTabs`

**Files:**

- Create: `apps/docs/src/components/mdx/PathTabs.astro` — wraps `Tabs` with fixed `labels={["newt/create","CLI","Existing project"]}` and `persistKey="install-path"`; slots `create`, `cli`, `existing` mapped to `tab-0..2`.
- Modify: `apps/docs/src/components/mdx/Tabs.astro` — nothing functional; add a comment noting `PathTabs` relies on the `:scope >` fix from commit pending.

- [x] Verify nesting: `PathTabs` → `Steps` → `PmTabs` renders and switching the outer tab does not disturb `pm` persistence (regression for the Manual→CLI bug).

### Task A4: Installation index rewrite

**Files:**

- Modify: `apps/docs/src/content/docs/installation.mdx`

- [x] New shape: intro line → `<PathTabs>` (create: "Open newt/create, pick a framework, copy the command" + link; cli: `PmTabs cmd="newtui@latest init --template <framework>"` + note that `--template` exists for Next, Vite (React), Vite (Vue) and Nuxt only, and that `init` alone is the command everywhere else; existing: `PmTabs cmd="newtui@latest init"` + `add button`) → `## Pick your framework` + `<FrameworkGrid>` → `## What init writes` (moved from `#written`, framework-agnostic parts only) → `## Options` (kept, trimmed to a table).
- [x] Move `#nuxt`, `#next`, `#html` sections into their sub-pages (Task A5). Keep the old anchors as `<a id>` stubs with one-line pointers so inbound links do not 404.
- [x] Keep `\{#id\}` escaped heading ids.

### Task A5: Ten sub-pages

**Files:**

- Modify: `apps/docs/src/content/docs/installation/{next,vite,nuxt,manual}.mdx`
- Create: `apps/docs/src/content/docs/installation/{vite-vue,astro,tanstack-start,react-router,laravel,html}.mdx`

Each page follows the template in the spec §5: `<PathTabs>` with three paths → `## What init writes` for that framework → one-liners linking dark mode and RTL guides.

- [x] `next.mdx`: create path shows `init --preset <code> --template next`; cli `init --template next`; existing: `create-next-app` → App Router `layout.tsx` import → `init` → `add`. Pull the App Router prose from the old `#next` section.
- [x] `vite.mdx` becomes React-only (title "Vite (React)"). Existing path: `create-vite --template react-ts` → Tailwind v4 (`@tailwindcss/vite`) → `tsconfig` paths + `vite.config.ts` alias → `init` → `add`.
- [x] `vite-vue.mdx` mirrors it with `--template vue-ts`, `App.vue` snippet, Tailwind via `@tailwindcss/vite`.
- [x] `nuxt.mdx`: pull the old `#nuxt` section; `--template nuxt`; existing path notes `@newtui/nuxt` module.
- [x] `astro.mdx`: React and Vue integrations, `client:*` islands, `.newt-root` on `<body>` in the layout, import order of `global.css`. Both `data-framework` blocks.
- [x] `tanstack-start.mdx`: `create-tsrouter-app` (or `npm create @tanstack/start`), Tailwind v4, `tsconfig` paths, `init`, `add`. The create and CLI tabs say plainly there is no `--template` and show `init --preset <code>` after the scaffold command.
- [x] `react-router.mdx`: `create-react-router`, Tailwind v4, `app/app.css` import, `.newt-root` on the root layout, `init`, `add`. Same no-template note.
- [x] `laravel.mdx`: `laravel new` with Inertia; two `data-framework` blocks for the React and Vue starter kits; Vite alias in `vite.config.js`, `resources/css/app.css`, `.newt-root` on the Blade layout, `init --framework react|vue`, `add`. Same no-template note.
- [x] `manual.mdx`: keep; add `PathTabs` with the create/cli tabs pointing back to the picker ("Manual has no CLI step").
- [x] `html.mdx`: pull the old `#html` section; `<link>` to `tokens.css` + per-component CSS; copy-paste of `packages/cli/registry/html/components/*`.
- [x] Every page has `title`, `description`, and a `.md` twin generated (check `dist/docs/installation/<slug>.md` exists after build).

### Task A6: Navigation

**Files:**

- Modify: `apps/docs/src/lib/nav.ts` — Installation group lists the ten pages in the spec order.
- Modify: `apps/docs/src/lib/install-targets.ts` — nav reads from it.

- [x] Sidebar renders ten entries; active state works on each.

### Task A7: Verify and commit

- [x] Playwright crawl of the eleven installation pages: no console errors, `PathTabs` persistence survives navigation, every card link resolves 200.
- [x] `verify-dist.mjs` REQUIRED gains `docs/installation/{vite-vue,astro,tanstack-start,react-router,laravel,html}/index.html`.
- [x] All gates. Commit `feat(docs): rebuild installation as a framework picker with three entry paths`.

---

## Phase B — Preset codec, CLI flags, newt/create

### Task B1: Preset codec in the CLI

**Files:**

- Create: `packages/cli/src/utils/preset.ts`
- Create: `packages/cli/src/utils/preset.test.ts`
- Create: `packages/cli/src/utils/__fixtures__/presets.json`

- [x] zod schema `presetSchema`: `{ v: literal(1), t: enum(…the ten `FRAMEWORK_IDS`…), b: /^#[0-9a-f]{6}$/i, r: enum(sm, md, lg), f: enum(inter, system, mono-first), m: enum(dark, light), d: enum(ltr, rtl) }`. Export `type Preset = z.infer<…>`.
- [x] `encodePreset(p): string` → `nt1.` + base64url(JSON with keys in schema order). `decodePreset(code): Preset` → strip prefix, parse, `presetSchema.parse`. Throw a typed `PresetError` with a one-line message on bad prefix / bad JSON / schema failure.
- [x] `presetToCss(p): string` → a second `:root` block after `TOKENS_MARKER`: `--newt-brand`, `--newt-brand-hover`, `--newt-brand-active` derived from `b` (reuse the hue-shift maths in `apps/docs/src/pages/themes.astro:~60-90`, ported to TS), radius trio from `r`, `--newt-font-sans`/`--newt-font-display` from `f`, and, for `m: light`, an `html { color-scheme: light }` + `data-newt-theme="light"` note in a comment. `d: rtl` emits `html { direction: rtl }`.
- [x] `templateFor(p): TemplateId | undefined` — `next`, `vite-react`, `vite-vue`, `nuxt` map to themselves, every other `t` returns `undefined`. The CLI errors if `--template` is passed a non-scaffoldable id, listing the four that work.
- [x] Fixture: nine presets (defaults, each axis flipped once, one all-flipped, one with a non-scaffoldable `t`) with `code` and `preset` fields. Tests: encode(fixture.preset) === fixture.code, decode(fixture.code) deep-equals fixture.preset, round trip, three failure cases.

### Task B2: `init --template` and `--preset`

**Files:**

- Modify: `packages/cli/src/utils/options.ts` — add `template`, `preset` to `STRING_FLAGS`; add `apply`, `preset` to `COMMANDS`.
- Modify: `packages/cli/src/commands/init.ts` — `InitOptions` gains `template?: Template`, `preset?: string`.
- Create: `packages/cli/src/utils/templates.ts` — `scaffoldTemplate(template, cwd, pm)`: `next` and `nuxt` copy `templates/{next,nuxt}-template` (already preconfigured, so skip the token step if `TOKENS_MARKER` present); `vite-react`/`vite-vue` run `create-vite` with `--template react-ts|vue-ts` via the detected package manager, then fall through to the normal `init` flow.
- Modify: `packages/cli/src/commands/init.test.ts` — cases for template scaffolding (mock the spawn) and preset writing order.
- Modify: `packages/cli/src/utils/updaters/update-css.ts` — accept an optional trailing block appended after the token block.

- [x] `init --preset <code>` in a fresh directory without `--template` fails fast: "`--preset` needs `--template` in an empty directory, or run it inside an existing project". A preset whose `t` has no template does not imply `--template`; there it is only metadata.
- [x] Order in the stylesheet: Tailwind preamble → `TOKENS_MARKER` block → `/* newt preset nt1.… */` block. The marker comment carries the code so `apply` can replace rather than duplicate.

### Task B3: `apply --preset` and `preset decode`

**Files:**

- Create: `packages/cli/src/commands/apply.ts` — resolves the global stylesheet like `init` does, decodes, replaces an existing `/* newt preset … */` block or appends one. `--dry-run` prints the block.
- Create: `packages/cli/src/commands/preset.ts` — `preset decode <code>` prints pretty JSON; `preset encode --framework … --brand …` is the inverse (handy for docs and tests).
- Modify: `packages/cli/src/index.ts` (command router), `packages/cli/README.md`, `skills/newt-ui/cli.md`, `.skills/newt-ui-cli/SKILL.md`.
- Create: `.changeset/newtui-presets.md` (minor).

- [x] Tests for replace-vs-append and for `preset decode` output on the fixture codes.
- [x] Commit `feat(newtui): add presets — init --template/--preset, apply, preset decode`.

### Task B4: Preset codec in the docs

**Files:**

- Create: `apps/docs/src/lib/preset.ts` — same schema and codec, hand-written (no import from the CLI). Adds `applyPreset(doc: Document, p)` writing inline custom properties on `document.documentElement`, and `presetCommand(p, pm)` → `pnpm dlx newtui@latest init --preset …`, with `--template <t>` appended only when `templateFor(p)` is defined, plus `scaffoldCommand(p, pm)` returning that framework's own create command for the six without a template.
- Create: `apps/docs/src/lib/__fixtures__/presets.json` — byte copy of the CLI fixture.
- Create: `apps/docs/src/lib/preset.test.ts` — same assertions plus `readFileSync` of both fixtures and `expect(a).toBe(b)`.
- Modify: `apps/docs/package.json` — `"test": "vitest run"`, devDependency `vitest`; `turbo.json` already runs `test` per package.

- [x] `pnpm --filter docs test` green.

### Task B5: `/create` island

**Files:**

- Create: `apps/docs/src/pages/create.astro` — `Base` layout, title "newt/create", `<CreateApp client:load />`.
- Create: `apps/docs/src/components/create/CreateApp.tsx` and `{FrameworkPicker,HuePicker,RadiusPicker,FontPicker,ThemePicker,DirectionPicker,PresetOutput,PreviewPane}.tsx`
- Modify: `apps/docs/src/styles/site.css` — `.create-*` layout: controls column start, preview end, output drawer bottom on mobile.

- [x] State: `useReducer` over `Preset`; `useEffect` syncs `?p=<code>` with `history.replaceState`; initial state from URL else defaults (`next`, `#5865f2`, `md`, `inter`, `dark`, `ltr`).
- [x] `HuePicker`: the five presets from `themes.astro` (Blurple, Violet, Teal, Amber, Rose) as swatches + a native `<input type="color">`. Labels via `aria-label`.
- [x] `PreviewPane`: renders real registry components through `ReactDemo`/`VueDemo` islands (`button`, `message`, `select-menu`, `toggle`, `radio`) inside a `.newt-root` whose style attribute carries the preset overrides. Follows `$framework` so the Vue reader sees Vue.
- [x] `FrameworkPicker` shows the same ten marks as the installation grid, reusing `INSTALL_TARGETS`; picking one without a template flips the output to "scaffold, then init".
- [x] `PresetOutput`: code (copy button), `PmTabs`-style install command for `init --preset` and `apply --preset`, share button that copies `location.href`.
- [x] Header nav: replace `/themes` "Themes" with `/create` "Create" in `apps/docs/src/lib/site.ts`.
- [x] Delete `apps/docs/src/pages/themes.astro` outright — no redirect. Grep the site for any remaining `/themes` link (today only `apps/docs/src/lib/site.ts:42`).

### Task B6: `/docs/create` page

**Files:**

- Create: `apps/docs/src/content/docs/create.mdx` — what a preset is, the code format (one table: key → axis → values), `init --preset`, `apply --preset`, `preset decode`, "share a preset".
- Modify: `apps/docs/src/lib/nav.ts` — Get Started gains "Create" after Installation.

### Task B7: Verify and commit

- [x] Playwright: open `/create`, change each control, read the emitted code, `newtui preset decode` it in Bash, compare; reload `/create?p=<code>` and assert every control's value.
- [x] `rg -n "/themes" apps/docs/src` returns nothing; `dist/themes` does not exist.
- [x] `verify-dist.mjs` REQUIRED gains `create/index.html` and `docs/create/index.html`, and drops `themes/index.html` (line 46 today).
- [x] All gates. Commit `feat(docs): add newt/create preset builder, retire /themes`.

---

## Phase C — Typeset

### Task C1: `typeset.css` in the HTML registry

**Files:**

- Create: `packages/cli/registry/html/components/typeset.css`
- Create: `packages/cli/registry/html/components/typeset.html` (a demo wrapper with headings, paragraphs, lists, table, blockquote, code, hr)

- [x] `.typeset { --typeset-size: 1em; --typeset-leading: 1.75; --typeset-flow: 1.25em; --typeset-font-body: var(--newt-font-sans); --typeset-font-heading: var(--newt-font-display); --typeset-font-mono: var(--newt-font-mono); font-size: var(--typeset-size); line-height: var(--typeset-leading); color: var(--newt-text-normal) }`.
- [x] Every block child gets `margin-block: 0 var(--typeset-flow)` via `:where(.typeset > *)`; headings scale off `--typeset-size` with `em` (h1 2em … h4 1.125em); `:where(.typeset :is(h1,h2,h3,h4) + *)` collapses the top gap.
- [x] Links `--newt-text-link`, `hr`/table borders `--newt-border`, inline code background `--newt-bg-secondary` radius `--newt-radius-sm`, `pre` matches `code-block`, blockquote border-inline-start (logical) 4px `--newt-border`.
- [x] Presets: `.typeset-docs` (defaults), `.typeset-chat` (`--typeset-size: .9375em; --typeset-leading: 1.375; --typeset-flow: .5em`), `.typeset-article` (`1.0625em / 1.8 / 1.5em`). Measure: `.typeset-measure { max-inline-size: 65ch }`.
- [x] Responsive table: `.typeset table` wrapped rules `display:block; overflow-x:auto` under `--newt-bp-sm`, mirroring shadcn-vue's approach.
- [x] Opt-out: `.typeset :where(.not-typeset, .not-typeset *)` resets margins and fonts.
- [x] RTL: only logical properties. Run `newtui migrate rtl --check` (or the `rewriteRtl` unit) on the file to confirm nothing physical slipped in.

### Task C2: Wrappers and registry item

**Files:**

- Create: `apps/www/registry/bases/newt/ui/typeset.tsx` — `Typeset({ preset = "docs", measure, className, ...props })` → `<div className={cn("typeset", \`typeset-${preset}\`, measure && "typeset-measure", className)} />`.
- Create: `apps/vue/registry/bases/newt/ui/typeset/{Typeset.vue,index.ts}`
- Create: `apps/www/registry/bases/newt/examples/typeset-demo.tsx`, `apps/vue/registry/bases/newt/examples/TypesetDemo.vue` — rendered markdown-shaped HTML in the three presets.
- Create: `apps/www/registry/meta/typeset.json` — `type: "registry:file"`, `files: ["typeset.css"]` targeting `typeset.css` next to the global stylesheet, `reactFiles: ["typeset.tsx"]`, `vueFiles: ["Typeset.vue","index.ts"]`, `reactDemo`, `vueDemo`.
- Modify: `scripts/gen-registry.mjs` — support `registry:file` with a `target` (check how `code-block` / blocks declare extra files; extend the same branch).
- Modify: `apps/www/registry/registry-categories.ts` — category `typography` (new) or `layout`, holding `typeset`.
- Modify: `apps/docs/scripts/verify-dist.mjs` — `NEWT_EXPECTED_COMPONENTS` 60 → 61; REQUIRED gains `r/styles/default/typeset.json` and the Vue twin.
- Create: `.changeset/newtui-typeset.md` (minor, registry).

- [x] `node scripts/gen-registry.mjs && pnpm --filter docs docs:gen` produce `components/typeset.mdx` starter; `pnpm registry:build` emits the item; `newtui add typeset` in a scratch Vite app writes `typeset.css` and the wrapper and imports the CSS after Tailwind.

### Task C3: `lib/typeset.ts`

**Files:**

- Create: `apps/docs/src/lib/typeset.ts`, `apps/docs/src/lib/typeset.test.ts`

- [x] Params schema (zod): `body`, `heading`, `mono` from a fixed font list (`inter`, `system`, `serif`, `mono-first`, `newt-display`), `size` 0.875–1.25 step .0625, `leading` 1.25–2 step .05, `flow` 0.5em–2em step .125, `measure` off|55ch|65ch|75ch, `locks` bitmask, `preset` docs|chat|article.
- [x] `parseParams(search)`, `toSearch(params)`, `shuffle(params, locks, rng)`, `toCss(params)` (emits a `.typeset-custom { --typeset-… }` block), `toWrapper(framework, params)` (React/Vue/HTML snippet).
- [x] Tests: URL round trip, shuffle respects locks, `toCss` emits only `--typeset-*` and `--newt-*` references.

### Task C4: `/typeset` island

**Files:**

- Create: `apps/docs/src/pages/typeset.astro`, `apps/docs/src/components/typeset/TypesetApp.tsx`, `{FontControl,RhythmControl,LockButton,ShuffleButton,PreviewSurface,GetCodeDrawer}.tsx`
- Modify: `apps/docs/src/styles/site.css` — `.typeset-app-*`

- [x] Controls column: Body / Heading / Mono `<select>`s with a lock each; Size / Leading / Flow `<input type="range">` with a lock each and the current value read out; Measure segmented; Preset segmented; Shuffle; Reset.
- [x] Preview tabs: **Message** (a `message` block with markdown-rich content), **Embed**, **Channel welcome**, **Docs article** — each rendered as static HTML inside `.typeset` with the live custom properties on the wrapper. Dark/light follows `$theme`; RTL toggle reuses the `demo-dir-toggle` pattern.
- [x] "Get Code" drawer: `typeset.css` install command (`PmTabs`-style), the `.typeset-custom` block if any control differs from the preset, the wrapper snippet for the active framework. "Open in new tab" opens `/typeset/preview?…` (a minimal page with just the preview surface).
- [x] Every control has a visible label; range inputs expose `aria-valuetext`.
- [x] Header nav gains "Typeset" after "Create".

### Task C5: `/docs/typeset` page

**Files:**

- Create: `apps/docs/src/content/docs/typeset.mdx`
- Modify: `apps/docs/src/lib/nav.ts` — Get Started gains "Typeset".

Sections, adapted from shadcn-vue's outline: Principles (three controls, tokens underneath) · Features · Installation (`add typeset`, import order) · Building your typeset (link to `/typeset`) · Presets (`docs`, `chat`, `article`) · Custom typesets · Themes and dark mode (everything resolves to `--newt-*`, so a light palette needs no extra rule) · RTL · Responsive table · Overrides · Opting out (`.not-typeset`) · Streaming (note on `--typeset-flow` keeping rhythm as content arrives; static demo) · Prior art (shadcn Typeset, Tailwind Typography, Every Layout's "Stack").

- [x] Prose in the project's voice; every section a `\{#id\}` anchor; a `<ComponentPreview name="typeset" />` up top.

### Task C6: Verify and commit

- [x] Playwright: `/typeset` round-trips URL params; shuffle changes only unlocked controls; Get Code contains `typeset.css` and a wrapper for React, Vue and HTML in turn.
- [x] `verify-dist.mjs` REQUIRED gains `typeset/index.html`, `docs/typeset/index.html`, `docs/components/typeset/index.html`.
- [x] All gates. Commit `feat(newtui): add Typeset — token-based rhythm styles for rendered markdown`, then `feat(docs): add /typeset builder and docs`.

---

## Phase D — Wrap-up

- [x] Update `skills/newt-ui/{SKILL.md,cli.md,customization.md}` and `.skills/newt-ui-{cli,registry,architecture}/SKILL.md` for presets, `--template`, Typeset.
- [x] `README.md` quick-start mentions `init --template` and links `/create`.
- [x] Update PR #16 body (English) with the three new capabilities.
- [x] Final full-site Playwright crawl (the existing 97-page script + the new pages), zero console errors.

## Verification checklist (whole plan)

| Check                      | Command / action                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| Installation cards resolve | crawl `/docs/installation`, follow each `.framework-card`                                                 |
| Path tab persistence       | pick "Existing project" on `/docs/installation`, open `/docs/installation/next`, tab is selected          |
| Preset round trip          | `/create` → code → `node packages/cli/dist/index.js preset decode <code>` → `/create?p=<code>`            |
| No-template framework      | pick Laravel on `/create`: output is `laravel new` then `init --preset <code>`, no `--template`           |
| Fresh project              | `pnpm dlx newtui@latest init --template next --preset <code>` in `/tmp`, `pnpm dev`, brand colour matches |
| Fixture parity             | `pnpm --filter cli test` and `pnpm --filter docs test` both assert identical fixture bytes                |
| Typeset item               | `newtui add typeset` in a scratch Vite app; `.typeset.typeset-docs` restyles markdown with no other CSS   |
| Gates                      | `format:check`, `lint`, `knip`, `typecheck`, `test`, `build`, `verify-dist`                               |
