---
"newtui": minor
---

Components a message feed needs can now be read-only, translated and themed.

- `Mention` takes `as="span"` for a mention that opens nothing (not focusable, no hover), and `as="a"` or `href` for one that navigates.
- `Reaction` takes `readonly` to show a count without a toggle, `emojiSrc` for a server emoji image with `emojiAlt` for its name, and `formatLabel` to translate its accessible name.
- `MessageGroupBotTag` takes `aria-label` (React) / `ariaLabel` (Vue) to replace "Application".
- `Button` renders a link with `href`, or any element or router link with `as`. A disabled link drops its `href` and sets `aria-disabled`.
- `MessageGroup` takes `as`, so a post can be an `<article>` or an `<li>`.
- Fixed colours are tokens now: `--newt-on-accent` (text and marks on brand fills), `--newt-overlay` (the modal scrim) and `--newt-bg-message-hover` (a message row on hover) replace `text-white`, `bg-white`, `bg-black/60` and `bg-black/[0.06]`, so these parts follow a light theme and token overrides.
