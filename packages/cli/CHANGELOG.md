# newtui

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
