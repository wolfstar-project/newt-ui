---
"newtui": minor
---

Rework the Discord-inspired components against the wolfstar.rocks originals, and add an opt-in light surface set.

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
