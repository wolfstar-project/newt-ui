# newtui

## 2.8.0

### Minor Changes

- [#66](https://github.com/wolfstar-project/newt-ui/pull/66) [`8144443`](https://github.com/wolfstar-project/newt-ui/commit/81444431b5c93ab081f02e6e5085d49f5623af5d) - Presets carry three more choices from newt/create: the base colour the surfaces are mixed from (`slate`, `neutral`, `stone`, `ink`), a heading font of its own, and the elevation shadows (`soft`, `flat`, `deep`). The radius scale gains `none` and `xl`, and the font stacks gain `serif` and `rounded`. `init --preset`, `apply --preset` and `preset css` write the matching `--newt-*` overrides, including both surface sets for a base colour: the light one in `:root` and the dark one under the project's dark selector, the way `init` lays the tokens out (`preset css` prints the other layout for an `html` preset, dark in `:root` and light under `.newt-light`, as `tokens.css` does; `init` and `apply` always write the installed one). Codes made before this release decode and encode exactly as they did.

### Patch Changes

- [#78](https://github.com/wolfstar-project/newt-ui/pull/78) [`b55af41`](https://github.com/wolfstar-project/newt-ui/commit/b55af41fe4be0175f8606928510f7b3494a848b2) - Read a `@newtui/<name>` dependency as an item of the registry it came from. The published registry now names its dependencies that way, so the shadcn CLI no longer looks for `chat` or `avatar` in its own default registry.

## 2.7.0

### Minor Changes

- [#63](https://github.com/wolfstar-project/newt-ui/pull/63) [`883e3e1`](https://github.com/wolfstar-project/newt-ui/commit/883e3e1459dc82c3f960c757aeeaaadb594e6611) - `add` and `view` accept `@registry/item` and install from third-party registries. A namespace resolves through `registries` in `components.json`, then through the community directory of the project's framework — shadcn/ui's for React, shadcn-vue's for Vue — so `newtui add @magicui/marquee` needs no configuration. On Tailwind v4 the first third-party install also maps shadcn's colour names onto the `--newt-*` tokens.

### Patch Changes

- [#65](https://github.com/wolfstar-project/newt-ui/pull/65) [`1370df5`](https://github.com/wolfstar-project/newt-ui/commit/1370df54439f2f824446a765da5ece943e07c174) - The embed sits on a translucent surface with a hairline outline and a straight accent bar, so it stands out on any background instead of matching `--newt-bg-elevated`. Two new tokens with light and dark values carry it: `--newt-embed-bg` and `--newt-embed-border`. `newtui init` leaves a stylesheet that already holds the tokens untouched, so an existing project adds the two variables by hand.

## 2.6.0

### Minor Changes

- [#57](https://github.com/wolfstar-project/newt-ui/pull/57) [`3aa8e2d`](https://github.com/wolfstar-project/newt-ui/commit/3aa8e2df7ad523c34ab37b22040f98de13c8d497) - `Spoiler`, `Modal` and `CodeBlock` are now accessible, translatable and themed, so the `markdown` item can render user content without patches.

  - `Spoiler` hides all of its content while closed, including links, inline code, mentions and emoji images, and makes it `inert`, so a hidden link cannot be clicked or reached with Tab. A new `label` prop sets its accessible name, and `Markdown` passes it the new `spoiler` entry of `MarkdownLabels`. The plain HTML flavour now needs `spoiler.js`, which handles the reveal by click, Enter or Space; the markup no longer carries an inline `onclick`, so a spoiler copied without the script stays hidden.
  - `Modal` moves focus to its first control when it opens (or to the dialog itself when it has none), keeps Tab and Shift+Tab inside, and returns focus to the element that opened it when it closes. The HTML flavour's `modal.js` does the same and removes its Escape listener when the modal closes.
  - New tokens with light and dark values: `--newt-spoiler` and `--newt-spoiler-hover` for the hidden chip, and `--newt-code-bg`, `--newt-code-keyword`, `--newt-code-string`, `--newt-code-comment` and `--newt-code-function` for the code block. They replace fixed hex values, so both parts follow a light theme and token overrides. `newtui init` leaves a stylesheet that already holds the tokens untouched, so an existing project adds the seven variables by hand; the values for both themes are on the colours page.

- [#56](https://github.com/wolfstar-project/newt-ui/pull/56) [`20b5d62`](https://github.com/wolfstar-project/newt-ui/commit/20b5d6262d171a96f5d6463a58a04facfd754334) - New `app-invite` component: the app directory card a link to an app unfurls into inside a message, with a cover banner, the app's icon and name, an optional description and a full-width call to action. Available for React, Vue and HTML/CSS (`newtui add app-invite`).

  The HTML `.newt-btn` no longer underlines when it is an `<a>`, matching the React and Vue buttons.

### Patch Changes

- [#58](https://github.com/wolfstar-project/newt-ui/pull/58) [`18b3d83`](https://github.com/wolfstar-project/newt-ui/commit/18b3d835e9469dd6cc19f1a270abee41f5bc1e32) - `markdown` lays out a message the way the client does. A list item indented under another one nests, with a circle bullet and then a square one. Blank lines stay empty lines, before and after a list as well as between paragraphs, and `_ _` is an empty line written on purpose. A heading takes the blank lines after it, and list spacing and indentation match the client.

- [#60](https://github.com/wolfstar-project/newt-ui/pull/60) [`07b11aa`](https://github.com/wolfstar-project/newt-ui/commit/07b11aa9633585a20a833b26d031b6a0b6033a7e) - Typeset now covers what a CommonMark and GFM renderer emits: task lists, footnotes, aligned table columns, `mark`, definition lists, `details` and `figure`, and a blockquote no longer keeps the browser's 40px indent. It no longer installs `spoiler` — chat markdown with mentions, timestamps and spoilers is the Markdown component's job.

## 2.5.0

### Minor Changes

- [#54](https://github.com/wolfstar-project/newt-ui/pull/54) [`9ba77fc`](https://github.com/wolfstar-project/newt-ui/commit/9ba77fcdec5805525ab841b62950ea4b52d45adc) - Components a message feed needs can now be read-only, translated and themed.

  - `Mention` takes `as="span"` for a mention that opens nothing (not focusable, no hover), and `as="a"` or `href` for one that navigates.
  - `Reaction` takes `readonly` to show a count without a toggle, `emojiSrc` for a server emoji image with `emojiAlt` for its name, and `formatLabel` to translate its accessible name.
  - `MessageGroupBotTag` takes `aria-label` (React) / `ariaLabel` (Vue) to replace "Application".
  - `Button` renders a link with `href`, or any element or router link with `as`. A disabled link drops its `href` and sets `aria-disabled`.
  - `MessageGroup` takes `as`, so a post can be an `<article>` or an `<li>`.
  - Fixed colours are tokens now: `--newt-on-accent` (text and marks on brand fills), `--newt-overlay` (the modal scrim) and `--newt-bg-message-hover` (a message row on hover) replace `text-white`, `bg-white`, `bg-black/60` and `bg-black/[0.06]`, so these parts follow a light theme and token overrides.

- [#54](https://github.com/wolfstar-project/newt-ui/pull/54) [`9ba77fc`](https://github.com/wolfstar-project/newt-ui/commit/9ba77fcdec5805525ab841b62950ea4b52d45adc) - `newtui init` no longer restyles the app it is added to, and its light theme now applies.

  - The stylesheet gets one complete light `:root`, and the dark values go under a selector you choose with `--dark-selector`: `class` (`.dark`, the default), `data-theme` (`[data-theme="dark"]`), `media` (the system preference) or any selector. The choice is saved as `tailwind.darkSelector` in `components.json`, and the printed Tailwind v3 preset sets `darkMode` to match. Before this, two `:root` blocks were written and the dark one won on every page.
  - The `@theme` block maps only `newt` names. It no longer redefines `--radius-sm/md/lg/full`, `--font-sans` or `--font-mono`, so an existing app keeps its own radii and fonts. Components now use Tailwind's own `rounded-*` and `font-*` scale; the raw `--newt-radius-*` and `--newt-font-*` variables are still written.
  - When `--css` names a new token file and another stylesheet already loads Tailwind, `init` leaves `@import "tailwindcss"` out and prints the line to import the token file from that entry.

- [#54](https://github.com/wolfstar-project/newt-ui/pull/54) [`9ba77fc`](https://github.com/wolfstar-project/newt-ui/commit/9ba77fcdec5805525ab841b62950ea4b52d45adc) - New `markdown` item: renders a message written in chat markdown with the library's own parts.

  ```tsx
  <Markdown
    content="**Deploy** done — ping <@1001> in <[#2002](https://github.com/wolfstar-project/newt-ui/issues/2002)> ||tomorrow|| at <t:1767225600:t>"
    resolveMention={(kind, id) => names.get(`${kind}:${id}`)}
  />
  ```

  It reads bold, italic, underline, strike, spoilers, inline and fenced code, `#`–`###` headings, `-#` subtext, lists, `>` and `>>>` quotes, links, and the `<@id>`, `<@&id>`, `<#id>`, `</command:id>`, `<:emoji:id>` and `<t:…>` tokens, and renders them as `Mention`, `InlineCode`, `CodeBlock`, `Spoiler`, `CustomEmoji` and `Timestamp`. The source is parsed into a tree, never injected as HTML, and only `http(s)` addresses become links. A masked link (`[text](url)`) shows its address in a dialog before it opens. Mention names and server emoji images come from the `resolveMention` and `resolveEmoji` callbacks; every label can be translated through `labels`. The parser is exported as `markdown-syntax` for code that wants the tree without rendering it.

### Patch Changes

- [#29](https://github.com/wolfstar-project/newt-ui/pull/29) [`c509c7e`](https://github.com/wolfstar-project/newt-ui/commit/c509c7e6c5b2e8e2eff42947053e7e3096f62410) - fix(deps): update all non-major dependencies Thanks [@renovate](https://github.com/apps/renovate)!

## 2.4.0

### Minor Changes

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add three components to the HTML and CSS distribution: `user-panel`, `side-nav` and `audit-log`. The React and Vue registries carry them under the same names, together with three new blocks built from them: `channel-sidebar`, `settings-layout` and `onboarding`.

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add five components to the HTML and CSS distribution: `alert`, `avatar-group`, `table`, `tree` and `calendar`. The tree and the calendar ship a script for keyboard navigation, and the calendar reads and reports dates as `YYYY-MM-DD` strings. The React and Vue versions are in the registry under the same names.

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add five form controls to the HTML and CSS distribution: `slider`, `pin-input`, `tag-input`, `number-input` and `color-picker`, each with its stylesheet, reference markup and a small script. The React and Vue versions are in the registry under the same names.

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - Add six components to the HTML and CSS distribution: `accordion`, `breadcrumb`, `stepper`, `popover`, `drawer` and `command-palette`. The drawer and the command palette are built on the native `<dialog>` element and the accordion on `<details>`, so focus trapping, Escape and single-open behaviour come from the browser. The React and Vue versions are in the registry under the same names.

### Patch Changes

- [#42](https://github.com/wolfstar-project/newt-ui/pull/42) [`a541f84`](https://github.com/wolfstar-project/newt-ui/commit/a541f848308376b49b31d492cbecb552b1fbcec5) - `add` now prints the right import line for a library item: it names the file under the `lib` alias instead of a path under `components/ui`, and prints nothing for an item that installs no files. This is what `newtui add nuxt-ui-theme`, the new Nuxt UI theme in the Vue registry, relies on.

## 2.3.0

### Minor Changes

- [#31](https://github.com/wolfstar-project/newt-ui/pull/31) [`d4e6318`](https://github.com/wolfstar-project/newt-ui/commit/d4e631899e83f9e251ded138da18cf4fd488ce31) - Add a Discord-inspired expressions picker for Unicode emoji and caller-supplied server emoji, stickers, and GIFs, with a category rail, collapsible sections, skin tones, a recently used section, a preview bar, grid keyboard navigation, and matching HTML, React, and Vue implementations.

## 2.2.1

### Patch Changes

- [#24](https://github.com/wolfstar-project/newt-ui/pull/24) [`dc0b233`](https://github.com/wolfstar-project/newt-ui/commit/dc0b233e13e524b76f5228e77322ad4b1032009e) - Update dependencies. `newtui` follows the narrower cancel type in `@clack/prompts` 1.8, and `@newtui/nuxt` annotates its default export so the declaration build no longer depends on an `@nuxt/schema` internal type.

## 2.2.0

### Minor Changes

- c7e6a09: `CodeBlock` colours its own source. Give it a `language` and the code, and the four colours it has — comment, string, keyword, call — are applied by a scanner that ships inside the component:

  ```tsx
  <CodeBlock language="ts">{`// example
  const greet = (name: string) => \`hello ${name}\`
  
  greet("world")`}</CodeBlock>
  ```

  Before this, every coloured run had to be placed by hand as a `CodeToken`, with the spaces and newlines between them written as JSX expressions to survive the whitespace rules. That is still available — `CodeToken` is exported, and children are rendered untouched when no `language` is given — but it is now the exception rather than the only way in.

  `language` accepts `ts`, `tsx`, `js`, `jsx`, `json`, `bash` and `sh`. The scanner is four answers, not a parse tree: six lines of code in a chat message should not drag a highlighter and a grammar in behind them. What it reads badly stays plain rather than wrong, and anything needing real grammar — a diff, a language not on that list, semantic colours — produces its own runs and passes them as `tokens`, an array of `{ text, kind? }`. `tokenizeCode` is exported for callers that want the runs without the markup.

  In Vue the source goes through the `code` prop, since a template collapses the newlines out of slot text.

  The plain HTML flavour is unchanged: it has no scanner to run, and its spans are the highlighting.

- c7e6a09: New `entity-select` item: the picker for the things a server already knows about — its members, its roles, its channels, or all of them at once.

  It is a separate control from the string select rather than a mode of it, because the rows are not strings. A member arrives with a face and sometimes an app tag, a role with a colour and a headcount, a channel with the glyph that says what kind of channel it is. `kind` says which of the four the list is drawn from; it only changes the wording shown when the server has nothing to offer.

  `max` above one turns the control into chips: the choices leave the list and sit in the trigger, each with a cross, and every row grows a box instead of a tick — the shape is what says whether picking this one un-picks the last. Backspace removes the chip nearest the caret. At the limit the list stays open and stops taking more rather than silently dropping the oldest choice.

  The list is capped at 25, which is what the platform accepts either way, and the panel shows its scrollbar rather than hiding it until the pointer moves: with a capped list the bar is what says there is more below the fold. The panel is portalled so an `overflow: hidden` ancestor cannot clip it, positioned from measured coordinates, and flipped above the control when the space below runs out.

  The whole control is one tab stop driven by `aria-activedescendant`, with the arrows, Home, End, Enter, Escape and Backspace all doing what they do everywhere else.

- c7e6a09: Give `form-fields` a validation state, and add three composed blocks.

  `Field` takes `invalid`, and the controls inside read it from the wrapper — so a form library that only knows "this field failed" says it in one place rather than per control. `FieldHelp` takes `variant="error"`, which colours the message and gives it `role="alert"`, because a validation message that appears after a failed submit is useless to a reader who is not looking at that part of the page. The same state exists in the plain HTML build as `.newt-field[data-invalid]` and `.newt-field__help--error`.

  Three new `registry:block` items, installed like any other component and composed entirely from ones that already exist:

  - `chat-window` — a whole channel view: header, scrolling message list and composer.
  - `server-sidebar` — the column beside it: the server banner, the voice channel and the grouped member list.
  - `command-panel` — a keyboard-selectable command list paired with the selected command's option card.

  The registry generator and public indexes now understand blocks, which live under `block/` and declare their own file lists rather than being named after a single file. Multi-file Vue blocks install into their own component directory.

- c7e6a09: Add an MCP server and three read-only commands, so an agent can discover the registry instead of guessing at it.

  `newtui mcp` runs a Model Context Protocol server over stdio, and `newtui mcp init --client claude|cursor|vscode|codex|opencode` writes the configuration each editor needs — merging into whatever is already in the file rather than replacing it. The server exposes eight tools, named to match shadcn's so an agent that knows one registry needs no new vocabulary: `get_project_registries`, `list_items_in_registries`, `search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries`, `get_add_command_for_items`, `get_audit_checklist`, and `get_design_tokens`, which returns the `--newt-*` palette. Two prompts, `install-component` and `build-with-newt`, walk the search-then-install path. Everything is read-only: installing stays a command somebody runs.

  Three new commands back it, and stand on their own:

  - `newtui info [--json]` prints what a project is — framework, bundler, Tailwind major, aliases, registry, and which components are installed.
  - `newtui search [query] [--json]` filters the registry by name, title or description.
  - `newtui view <components...> [--json]` prints an item's source without installing it.

  The package now ships a test suite (`vitest`), covering registry URL resolution, the MCP tool and prompt surface, and that `mcp init` preserves the servers a config already had.

- c7e6a09: Presets: a project's brand hue, radius scale, font stack, surface mode and direction can now be chosen once in newt/create and handed to the CLI as a code.

  A preset code is `nt1.<base64url>` over a versioned payload, and it is a set of overrides for tokens that already exist — never a second theme file. `newtui init --preset nt1.…` writes the block into the global stylesheet after the tokens it overrides, fenced by two comments so it can be found again; `newtui apply --preset nt1.…` does that step alone, for a project that ran `init` some time ago, replacing an existing block instead of stacking a second one that would silently win.

  `newtui init --template <next|vite-react|vite-vue|nuxt>` creates the project first, by running the creator that framework maintains, then continues with the usual `init` inside the result. The other targets the docs cover — Astro, TanStack Start, React Router, Laravel — are created with their own tool and `init` runs afterwards; a preset still records which one you were aiming at, it just does not imply a template.

  `newtui preset decode <code>` prints what a code carries, with `encode` and `css` for the other two directions. The codec is pinned by a golden fixture shared with the documentation site, so the builder and the CLI cannot drift apart.

- c7e6a09: Every component now uses CSS logical properties, so a right-to-left interface is a `dir` attribute rather than a second stylesheet.

  The conversion covers all three flavours — the HTML/CSS spec, the React registry and the Vue registry: `margin-left` becomes `margin-inline-start`, `left:` becomes `inset-inline-start`, `border-top-left-radius` becomes `border-start-start-radius`, and the Tailwind utilities follow the same mapping (`ml→ms`, `pr→pe`, `left-→start-`, `rounded-tl→rounded-ss`, `border-l→border-s`, `text-left→text-start`). A test asserts that no physical spelling comes back.

  The one thing CSS cannot express logically is the sign of a sideways transform, so `tokens.css` gains `--newt-dir`, which is `1` normally and `-1` under `[dir="rtl"]`. A component that moves something sideways multiplies by it — the switch thumb in `form-fields` is the worked example.

  New `direction` item: `DirectionProvider` sets `dir` on a subtree and exposes it through React context or Vue injection, for the components that have to decide which way is forward rather than which way is left. In the plain HTML build the attribute is the whole feature.

  New `newtui migrate rtl [--dry-run]` rewrites components installed before this change, in place, reporting every substitution per file. It is idempotent, and it flags `space-x-*` — which is not direction-safe on Tailwind v3 — rather than converting it silently.

- c7e6a09: New `typeset` item: the styles for rendered markdown, which is the one thing a component library cannot cover with components — what arrives is whatever the renderer emitted, with no classes you chose.

  Typeset styles that markup from the outside through three variables: `--typeset-size` is the base every other size is an `em` of, `--typeset-leading` is the line height, and `--typeset-flow` is the space between block children. One rule owns the rhythm — every block child carries the same trailing margin and none carries a leading one — so a paragraph's spacing never depends on what happens to sit above it. Everything else resolves to a `--newt-*` token, which is why a typeset block follows the palette, the light surfaces and a preset without knowing they exist.

  The elements it covers are the ones a chat markdown parser emits: headings, paragraphs, lists, quotes, tables, inline and fenced code, links, and the inline set — `strong`, `em`, `u`, `s`, and the `small` a subtext line becomes.

  Three presets cover the surfaces this library renders into: `typeset-docs` for long-form reading, `typeset-chat` for conversation, `typeset-article` for editorial text. `typeset-measure` caps the line length, `not-typeset` takes an island of interface back out of the rhythm, and a table scrolls sideways below the narrow breakpoint rather than widening the page.

  Every selector is wrapped in `:where()`, so a utility class or a component class overrides it without `!important`, and the whole stylesheet is written in logical properties, so `dir="rtl"` is the entire RTL story.

  `newtui add typeset` appends the stylesheet and writes a thin `Typeset` wrapper for React or Vue; the plain flavour is the two class names on their own.

### Patch Changes

- c7e6a09: Align the application registry and CLI source layouts with the current shadcn
  React and Vue repositories while preserving legacy registry import rewrites.
- 88af7f0: `init` and `add` now resolve a Nuxt project's write paths under `app/` when the project uses Nuxt 4's source root, instead of always guessing `src/` or the project root.

  Detection checks, in order: an explicit `srcDir` in the target's `nuxt.config`, what already exists on disk (`app/` wins over `src/`), then — for a brand-new project with neither directory yet — the installed (or opted-in, via `future.compatibilityVersion: 4`) Nuxt major. A plain Nuxt 3 project keeps resolving at the root, as before. `DEFAULT_TAILWIND_CSS` is now keyed by bundler (`nuxt`/`vite`) instead of framework, so a fresh Vite Vue project with no existing stylesheet no longer falls back to a Nuxt-shaped default path.

## 2.1.0

### Minor Changes

- 06f4a30: Rework the Discord-inspired components against the wolfstar.rocks originals, and add an opt-in light surface set.

  Tokens: new `--newt-bg-input-elevated`, `--newt-mention-text`, `--newt-mention-role` and `--newt-embed-max-width`; a `.newt-light` / `[data-newt-theme="light"]` block overrides the surfaces, text, status and shadow tokens for light backgrounds. The mention/badge/timeline/reaction/slash-command hex values that duplicated `#b3baff` and `#f3b95f` now read the tokens.

  Components:

  - `Mention` renders a real button with focus styles, gains an optional avatar, an `app` variant and a `color` prop for role mentions.
  - `Button` gains `emoji` and the link-out glyph (`launchIcon`, on by default for `variant="link"`).
  - `Embed` gains an accent `color`, an author row, a footer icon, a middle-dot separator and a `<time>` timestamp.
  - `MemberList` gains role sections with headings, an offline state, coloured names and the APP tag (with the verified check).
  - `ReplyPreview` gains an avatar, a "used" action and a slash-command chip; the spine is now driven by custom properties.
  - `MessageGroup` gains a reply grid layout, an ephemeral state with its notice, the verified bot tag, and renders the timestamp as `<time>`.
  - `Divider` gains `spacing` and `line`.
  - `ScrollArea` gains `focusable` and `viewportLabel`.
  - `SlashCommand` now takes the full invocation: subcommand path plus typed options, including the focused one.
  - `SelectMenu` is now a complete combobox: trigger, keyboard-driven listbox, portalled panel that flips when space runs out.

  New components: `InlineCode`, `ActionRow`, `MessageList`, `MessageComposer`, `Chat`, `Invite`, `ChannelHeader`, `ChannelWelcome`, `ChannelInfo`, `SlashCommandSuggestions`, `V2Container` and `AppLauncher`, plus a `ReactionGroup` part on `Reaction`.

## 2.0.0

### Major Changes

- 546bd96: Unify the two CLIs into a single unscoped `newtui` package, and add `framework` to registry items.

  `@newtui/react` and `@newtui/vue` were the same CLI twice, differing only in the paths they wrote and the registry they read. They are now one package, `newtui`, which decides between React and Vue from `framework` in `components.json`:

  ```bash
  npx newtui init          # detects React or Vue, or pass --framework react|vue
  npx newtui add button
  ```

  Both scoped packages still install and still work — each now ships a wrapper that prints a deprecation notice and forwards to `newtui`. They are removed in the next major.

  An existing `components.json` needs no changes. It is migrated on read:

  - the old Vue `framework: "nuxt" | "vite"` becomes `bundler`, and `framework` becomes `"vue"`
  - the old React `tsx` is read as `typescript`
  - a config with neither field is matched to a framework by the aliases it declares

  Registry items now carry `framework: "react" | "vue"`, stamped by each app's registry build and validated by `registryItemSchema`, so a single item JSON says which framework it targets. The two registries keep their existing urls (`/r` and `/vue/r`), so nothing consuming them has to change.
