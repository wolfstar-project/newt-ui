# Docs redesign — Roadmap for phases 2–6

> **For agentic workers:** this file is the phase outline. Before executing a phase, expand it into a full task-level plan with superpowers:writing-plans (same header format as the phase 1 plan) and get it approved. Do not execute from this outline directly.

**Spec:** `docs/superpowers/specs/2026-09-07-docs-redesign-design.md`
**Prerequisite:** phase 1 merged (`docs/superpowers/plans/2026-09-07-docs-redesign-phase-1-astro-foundation.md`).

Each phase is one PR. Global constraints from the phase 1 plan apply to all.

---

## Phase 2 — Docs content (no changeset)

Goal: fill the shadcn IA with real pages, seed the changelog, ship Colors.

### Tasks

1. **Nav groups.** Extend `src/lib/nav.ts` with the Get Started list, `Design`, `Installation`, `Dark Mode`, `Forms` (overview only until phase 6), `Registry` groups from spec §4. Add `badge: "new"` support from frontmatter.
2. **Get Started pages** (`src/content/docs/*.mdx`): `components-json` (schema from `packages/newtui/src/tools/config.ts:36-77` — `style`, `typescript`, `rsc`, `tsx`, `tailwind.*`, `aliases.*`, `iconLibrary`, `registry`), `theming` (token convention, groups from `registry-tokens.ts`, overriding a token, light palette, Tailwind v3 preset vs v4 `@theme`, "adding a token" = edit `tokens.css` first), `dark-mode` (index card grid + `next`, `vite`, `nuxt` pages: `data-newt-theme` attribute, `color-scheme`, persisted toggle snippet per framework), `cli` (reference for `init`, `add`, `list`, `diff`, every flag from `src/index.ts:78-117`; phase 3 appends `info`, `search`, `view`, `mcp`, `migrate`), `javascript` (`"typescript": false` in components.json, what `transformTypeScript` strips), `html-css` (legacy `newtui-html` CLI, `registry/html/registry.json` shape, tokens.css include order).
3. **Installation split.** `installation.mdx` becomes an index card grid; per-bundler pages `installation/next.mdx`, `vite.mdx`, `nuxt.mdx`, `manual.mdx`, `html.mdx` moved from today's `#next`, `#nuxt`, `#html`, `#written` sections. Redirect map in `astro.config.ts` `redirects` for `/docs/installation#…` is not possible (anchors); keep `installation.mdx` "Requirements" + `init` + `add` + tokens on the index page so old deep links still land on relevant content.
4. **Design pages** from `AGENT_GUIDE.md`: `design.mdx` (§1 what newt/ui is, §2 naming conventions, §3 reference palette rewritten as token table, §6 motion rules), `accessibility.mdx` (§5 checklist), `trademark.mdx` (`DISCLAIMER.md` verbatim sections). `AGENT_GUIDE.md` stays the contributor source; add a note at its top pointing to the docs pages.
5. **Registry section**: `registry/index.mdx` (why: shadcn-compatible `registry.json`, two per-framework registries, `--registry` flag, `NEWT_REGISTRY_URL`), `getting-started.mdx` (serve `index.json` + `styles/default/<name>.json` statically; point at `apps/www/scripts/build-registry.mts` as the reference builder; test with `newtui add --registry https://…`), `registry-json.mdx` and `registry-item-json.mdx` (fields from `packages/newtui/src/tools/schema.ts` incl. `framework`, `cssVars.{theme,light,dark}`, `tailwind.config`), `examples.mdx` (ui item, item with registryDependencies, theme item = `registry-themes.ts`, example item). `registry/mcp.mdx` lands in phase 3.
6. **Changelog collection.** `src/pages/docs/changelog/index.astro` (list newest first, date, title, description) and `src/pages/docs/changelog/[id].astro` (entry page, `pager: false`). Seed `src/content/changelog/`: `2026-08-components-rework.mdx` (from `.changeset/discord-components-rework-phase-1.md` + PR #12: new components with `<ComponentPreview>` embeds), `2026-08-npm-oidc.mdx` (PR #13/#14 trusted publishing), `2026-09-docs.mdx` (this redesign, written when phase 1 ships). Update root `CHANGELOG.md` to point at `/docs/changelog` and stop listing components. Add to `.changeset/README.md` release runbook: "add a changelog MDX entry for user-visible changes".
7. **Colors page** `src/pages/colors.astro`: groups from `registry-tokens.ts` (`newtTokens`, `newtTokensLight`), swatch + name + dark value + light value + Tailwind utility (`bg-newt-brand`), click-to-copy `var(--newt-brand)`. Header link `Colors` unhidden.
8. **Component pages, first pass.** For the 12 most-used components (button, avatar, badge, embed, message-group, member-list, select-menu, modal, tabs, tooltip, form-fields, chat): add `## Examples` (new demo files `apps/www/registry/default/example/<name>-<variant>-demo.tsx` + Vue twins, registered by `scripts/gen-registry.mjs` as `registry:example` items), `## API reference` via a `<PropsTable>` MDX component fed by a hand-written JSON block per part, `## Accessibility` where the component has keyboard behaviour (tabs, select-menu, modal, dropdown, context-menu, message-composer). Remaining 43 components get examples incrementally after this phase.
9. **`.skills/newt-ui-components/SKILL.md`**: add the "done" criteria: component MDX has Examples + API reference.

Acceptance: every sidebar link resolves; `llms.txt` lists all new pages; `verify-dist.mjs` gains `colors/index.html`, `docs/changelog/index.html`, `docs/theming/index.html`.

---

## Phase 3 — CLI: `info`, `search`, `view`, `mcp` (changeset `newtui` minor)

Goal: agents can discover and install newt/ui through MCP; the CLI exposes the project facts the skill needs.

### Tasks

1. **Test infrastructure.** Add `vitest` to `packages/newtui` (`"test": "vitest run"`), first test for `getRegistryUrl` (`src/tools/registry.ts:22-31`). Turbo `test` task already exists.
2. **`newtui info [--json]`** (`src/commands/info.ts`): reads `components.json` via `getConfig`, detects Tailwind major (`src/tools/tailwind.ts`), package manager (`package-manager-detector`), lists installed components by scanning `resolvedPaths.ui` for `<name>.tsx` / `<name>/index.ts` and matching registry index names. Output JSON shape:
   ```ts
   interface ProjectInfo {
     framework: "react" | "vue"
     bundler?: "nuxt" | "vite"
     typescript: boolean
     tailwind: { version: 3 | 4; css: string; config?: string }
     aliases: Record<string, string>
     registry: string
     installed: string[]
     cli: string
   }
   ```
3. **`newtui search [query] [--json]`**: `list` with case-insensitive filter over `name`, `title`, `description`; `list` stays as alias.
4. **`newtui view <name...>`**: fetch items, print each file with a header; `--json` prints the items.
5. **MCP server** `src/mcp/server.ts` with `@modelcontextprotocol/sdk` (`McpServer` + `StdioServerTransport`, `registerTool` with zod shapes — zod ^3.24 already a dependency; confirm SDK 1.30 accepts zod 3 shapes, else pin the `zod/v3` compat path). Tools (all read the project's `components.json` when `cwd` has one, otherwise default registries):
   - `get_project_registries` → `{ framework, registryUrl }`
   - `list_items_in_registries` `{ framework?: "react"|"vue", type?: string }` → index items (name, title, description, type)
   - `search_items_in_registries` `{ query: string, framework? }` → filtered items
   - `view_items_in_registries` `{ names: string[], framework? }` → full items with file contents
   - `get_item_examples_from_registries` `{ name: string, framework? }` → `<name>-demo` item + any `<name>-*-demo`
   - `get_add_command_for_items` `{ names: string[] }` → `npx newtui@latest add …` (package manager from `info`)
   - `get_audit_checklist` → static checklist (tokens not hex, `.newt-root` boundary, a11y checklist from `/docs/accessibility`, trademark rule)
   - `get_design_tokens` `{ theme?: "dark"|"light" }` → `tokens.css` parsed into `{ name, value }[]` (fetched from `${registryUrl}/styles/default/theme-newt.json` `cssVars`)
     Prompts: `install-component` (args `name`), `build-with-newt` (args `description`).
     Command wiring in `src/index.ts`: `mcp` → start server; `mcp init --client <claude|cursor|vscode|codex|opencode>` → write `.mcp.json` (`{"mcpServers":{"newtui":{"command":"npx","args":["newtui@latest","mcp"]}}}`), `.cursor/mcp.json` (same shape), `.vscode/mcp.json` (`{"servers":{"newtui":{"command":"npx","args":[…]}}}`), `~/.codex/config.toml` append `[mcp_servers.newtui] command="npx" args=["newtui@latest","mcp"]`, `opencode.json` (`{"mcp":{"newtui":{"type":"local","command":["npx","newtui@latest","mcp"]}}}`). Merge into existing files, never clobber.
6. **Tests**: `InMemoryTransport.createLinkedPair()` client ↔ server; `listTools` returns the 8 names; `search_items_in_registries` against a mocked `fetch` serving a fixture `index.json`; `mcp init` writes each client file into a temp dir and merges into a pre-existing one.
7. **`tsdown.config.ts`**: `deps.neverBundle` keeps the SDK external; confirm `dist/index.js` still starts with the shebang and `node dist/index.js mcp` answers an `initialize` request piped on stdin.
8. **Docs**: `src/content/docs/mcp.mdx` (structure from shadcn: components.json note → Quick start tabs per client with `npx newtui@latest mcp init --client …` + 3 sample prompts → What is MCP → How it works → Configuration (manual snippets) → Example prompts → Troubleshooting), `registry/mcp.mdx` (what a third-party registry must serve for the tools to work: `index.json` with `title`/`description`), `cli.mdx` gains `info`, `search`, `view`, `mcp`. `using-with-ai.mdx` links to `/docs/mcp` and `/docs/skills`.
9. **Changeset**: `newtui` minor — "Add `info`, `search`, `view` and an MCP server (`newtui mcp`, `newtui mcp init --client`)".
10. **`.skills/newt-ui-cli/SKILL.md`**: document the new commands and the `src/mcp/` layout.

Acceptance: from Claude Code with `.mcp.json` written by `mcp init`, `/mcp` lists `newtui` with 8 tools; `search_items_in_registries {query:"avatar"}` returns `avatar`, `status-indicator`, `member-list`.

---

## Phase 4 — Skills (no changeset)

Goal: `npx skills add wolfstar-project/newt-ui` installs a consumer skill for Claude Code, Cursor, Codex and friends.

### Tasks

1. **Layout**: `skills/newt-ui/SKILL.md` + `skills/newt-ui/cli.md`, `theming.md`, `mcp.md`, `rules/composition.md`, `rules/tokens.md`, `rules/accessibility.md`, `rules/trademark.md`. Verify the exact directory the `skills` CLI (v1.5.x) scans by running `npx skills add wolfstar-project/newt-ui --list` against the branch (or a fork) before finalising; adjust to `skills/` vs `.agents/skills/` accordingly.
2. **SKILL.md** frontmatter `name: newt-ui`, `description: Use when building Discord-inspired UI with newt/ui components in React, Vue or Nuxt: installing, composing, theming with --newt-* tokens, RTL, forms.`, `allowed-tools: Bash(npx newtui@latest *)`. Body: dynamic context `` !`npx newtui@latest info --json` `` (phase 3 command), principles (copy-paste, tokens over hex, `.newt-root` boundary, HTML spec is truth), critical rules with Incorrect/Correct pairs (hardcoded `#5865f2` vs `bg-newt-brand`; wrapping a `Button` in a custom class instead of a variant; putting Discord logos in demos), discovery (`newtui search`, `newtui view`, MCP), links to `/docs/*.md` twins and `/llms.txt`.
3. **Sync with internal skills**: the five `.skills/*` remain contributor-facing; add a short "Consumer skill lives in `skills/newt-ui`" note to `.skills/newt-ui-architecture/SKILL.md` and `AGENTS.md`. Exclude `skills/` from `skilld` (`.claude/skills/skilld-lock.yaml` untouched; confirm `skilld prepare` ignores the root `skills/` dir).
4. **Docs**: `src/content/docs/skills.mdx` — 5 example prompts → Install (`npx skills add wolfstar-project/newt-ui`, `-a claude-code`) → What's included (project context via `newtui info --json`, CLI commands, theming, MCP) → How it works → Learn more. Add `Skills` to the Get Started nav.
5. **CI**: `zizmor` unaffected; add a `skills` lint step only if the `skills` CLI ships a validator (`npx skills check`), otherwise skip.

Acceptance: fresh temp project, `npx skills add wolfstar-project/newt-ui -a claude-code -y` creates `.claude/skills/newt-ui/SKILL.md`; Claude Code lists the skill.

---

## Phase 5 — RTL (changeset `newtui` minor)

Goal: every component renders correctly under `dir="rtl"`; users get a `direction` provider and a migration command.

Audit (2026-09-07): 25 physical usages in `packages/newtui/registry/html/components/*.css` (top: reply-preview 4, voice-channel/tooltip/status-indicator/select-menu/form-fields/app-launcher 2 each), 29 in `apps/www/registry/default/ui/*.tsx`, 29 in `apps/vue/app/lib/registry/default/ui/**`. No `[dir=` handling anywhere. No directional icon found by name; inline SVGs must be checked by eye (reply arrow in reply-preview, chevrons in select-menu/dropdown/channel-header, send glyph in message-composer).

### Tasks

1. **Tokens**: `tokens.css` adds `--newt-dir: 1;` on `:root` and `[dir="rtl"] { --newt-dir: -1; }`; mirror into `registry-tokens.ts` (`newtTokens`), `apps/docs/src/styles/site.css`, `apps/www/styles/globals.css`, `apps/vue/app/assets/css/main.css`. Regenerate with `node scripts/gen-registry.mjs`.
2. **HTML/CSS layer**: convert the 25 usages with the mapping in spec §5 (RTL). `translateX(N)` → `translateX(calc(var(--newt-dir) * N))`. Keep `tokens.css` otherwise unchanged. Verify with `rg` that the physical regex from the audit returns 0 in `registry/html/components`.
3. **React layer**: convert the 29 Tailwind usages (`ml→ms`, `mr→me`, `pl→ps`, `pr→pe`, `left-→start-`, `right-→end-`, `rounded-l→rounded-s`, `rounded-r→rounded-e`, `rounded-tl→rounded-ss`, `rounded-tr→rounded-se`, `rounded-bl→rounded-es`, `rounded-br→rounded-ee`, `border-l→border-s`, `border-r→border-e`, `text-left→text-start`, `text-right→text-end`, `space-x-N→gap-N` on flex parents, `translate-x-N→[transform:translateX(calc(var(--newt-dir)*Npx))]` or the arbitrary `translate-x-(--newt-offset)` form). Tailwind 3.4 in `apps/www` supports logical utilities natively.
4. **Vue layer**: same 29 conversions in `.vue` files and `index.ts` class constants (e.g. `status-indicator/index.ts`, `form-fields/index.ts` `controlClassName`).
5. **Directional glyphs**: mirror inline SVG arrows with `[dir=rtl] & { transform: scaleX(-1) }` (CSS) / `rtl:-scale-x-100` (Tailwind) on the specific `<svg>` elements found in step 5's eye check; list them in the phase plan.
6. **`direction` item**: React `apps/www/registry/default/ui/direction.tsx` (`DirectionProvider({ dir, children })` sets `dir` on a wrapper `div` + context; `useDirection()` returns `"ltr"|"rtl"`); Vue `direction/DirectionProvider.vue` + `direction/useDirection.ts` (provide/inject); HTML doc: set `dir` on `<html>` or the `.newt-root` wrapper. Meta `registry/meta/direction.json`, category `utilities`, demos `direction-demo.tsx` / `DirectionDemo.vue` showing a message-group + composer under `rtl`. Use it in `select-menu` and `dropdown` to flip panel alignment where they compute positions in JS (`select-menu.tsx:85` neighbourhood, `SelectMenu.vue:58`).
7. **`newtui migrate rtl [--dry-run]`** (`src/commands/migrate.ts`, `src/tools/transformers/rtl.ts`): walk `resolvedPaths.ui`, apply the class mapping table from step 3 to `className=`/`class=`/`cva(` strings and to template literals, report per-file diff, write unless `--dry-run`. Unit tests: table-driven `transformRtlClasses("ml-2 pr-4 rounded-l-md text-left")` → `"ms-2 pe-4 rounded-s-md text-start"`, idempotent on already-logical input, leaves `space-x` untouched but warns.
8. **Docs**: `rtl.mdx` (Get started: set `dir`, add `DirectionProvider`, fonts note → How it works: logical properties + `--newt-dir` → Supported components: all → Animations → Migrating: `newtui migrate rtl`, manual mapping table, icons). Component pages for `direction`, `select-menu`, `message-composer`, `reply-preview` get an `## RTL` example (`<ComponentPreview name="…" demo="rtl" />` with a `dir="rtl"` wrapper demo). `design.mdx` gains the rule "logical properties only"; `.skills/newt-ui-components/SKILL.md` and `AGENT_GUIDE.md` §4 gain the same rule; `skills/newt-ui/rules/styling.md` gains an Incorrect/Correct pair.
9. **Docs site RTL preview toggle**: `ComponentPreview` gains a small `dir` toggle button (LTR/RTL) on the preview frame only, not a site-wide setting.
10. **Manual checklist**: the phase plan lists all 55 components; each is opened in RTL in the docs site and ticked. Any component whose layout still breaks is fixed in the same PR.
11. **Changeset** `newtui` minor: "All components use CSS logical properties and render under `dir=\"rtl\"`; new `direction` item; new `newtui migrate rtl`".

Acceptance: physical regex count is 0 in all three layers except deliberate exceptions listed in the plan; 55/55 checklist ticked; `migrate rtl` tests green.

---

## Phase 6 — Forms, Blocks, Themes (changeset `newtui` minor)

### 6a. Forms

1. **`form-fields` invalid state**: `Field` gets `invalid?: boolean` (sets `data-invalid`, `aria-invalid` on the control, error colour from `--newt-status-danger`), `FieldHelp` gets `variant?: "help" | "error"` with `role="alert"` for errors, `Input`/`Textarea`/`Select`/`Checkbox`/`Switch` accept `aria-describedby` passthrough. Same in HTML/CSS spec (`form-fields.css` `.newt-field[data-invalid]`) and Vue. Regenerate registry.
2. **Guides** `forms/index.mdx` (framework picker cards), `forms/react-hook-form.mdx` (React), `forms/tanstack-form.mdx` (React + Vue with `data-framework` blocks), `forms/vee-validate.mdx` (Vue). Each: Demo → Approach → Anatomy → Schema (zod) → Build the form → Validation → Displaying errors → Field types (Input, Textarea, Select, Checkbox, Switch) → Resetting → Array fields.
3. **Demos**: `form-react-hook-form-demo.tsx`, `form-tanstack-demo.tsx`, `FormTanstackDemo.vue`, `FormVeeValidateDemo.vue` (a "Create channel" form: name, topic, category select, NSFW switch, slowmode). Libraries (`react-hook-form`, `@hookform/resolvers`, `@tanstack/react-form`, `@tanstack/vue-form`, `vee-validate`, `@vee-validate/zod`, `zod`) are devDependencies of `apps/www` / `apps/vue` only (demos are not registry ui items).
4. Nav group `Forms` unhidden; `skills/newt-ui/rules/forms.md` written.

### 6b. Blocks

1. **Registry support**: `scripts/gen-registry.mjs` reads `registry/meta/*.json` with `"type": "registry:block"` and `files` arrays; emits `registry-blocks.ts` and `public/r/styles/default/<block>.json` with all files; Vue builder mirrors it. Schema already has `registry:block`.
2. **Blocks** (React `apps/www/registry/default/block/<name>/`, Vue `apps/vue/app/lib/registry/default/block/<Pascal>/`): `chat-window`, `server-sidebar`, `command-panel` (spec §5). Each composes existing ui items via `registryDependencies` and ships realistic placeholder data (no real usernames or Discord assets).
3. **Docs site**: `src/pages/blocks/index.astro` (gallery: full-width preview per block with framework toggle, "View code", `npx newtui@latest add <block>` copy) and `blocks/[name].astro` (single block, files tree, each file's source). `ComponentPreview` gains `size="full"`. Header `Blocks` unhidden.
4. **CLI**: `newtui add chat-window` works unchanged (block is a registry item); `list --type registry:block` lists blocks.

### 6c. Themes

1. `src/pages/themes.astro`: side-by-side showcase (chat-window block + a card of buttons/badges) under dark and light; a brand-hue picker (5 presets + a colour input) that rewrites `--newt-brand`, `--newt-brand-hover`, `--newt-brand-active` live via `document.documentElement.style` and shows a copyable `:root { … }` block; "Reset". No preset codes, no persistence beyond the page.
2. `theming.mdx` links to `/themes` and `/colors`; header `Themes` unhidden.
3. Changeset `newtui` minor: "form-fields gain an invalid state; new blocks chat-window, server-sidebar, command-panel".

Acceptance: `verify-dist.mjs` gains `blocks/index.html`, `themes/index.html`, `docs/forms/index.html`, `r/styles/default/chat-window.json`, `vue/r/styles/default/chat-window.json`; all four form demos submit with validation errors shown through `FieldHelp variant="error"`.

---

## Cross-phase checklist

- After every phase: `pnpm format:check && pnpm lint && pnpm knip && pnpm typecheck && pnpm build`, Lighthouse a11y ≥ 95 on one new page, `llms.txt` includes the new pages, changelog entry MDX added (phase 2 onward).
- Keep `AGENTS.md`, `README.md`, `.skills/*` in sync with any path or command the phase changes.
- Trademark review of every new demo/block: no Discord logos, wordmarks or real usernames; copy says "Discord-inspired".
