---
"newtui": minor
---

`Spoiler`, `Modal` and `CodeBlock` are now accessible, translatable and themed, so the `markdown` item can render user content without patches.

- `Spoiler` hides all of its content while closed, including links, inline code, mentions and emoji images, and makes it `inert`, so a hidden link cannot be clicked or reached with Tab. A new `label` prop sets its accessible name, and `Markdown` passes it the new `spoiler` entry of `MarkdownLabels`. The plain HTML flavour gains `spoiler.js`, which adds keyboard reveal.
- `Modal` moves focus to its first control when it opens (or to the dialog itself when it has none), keeps Tab and Shift+Tab inside, and returns focus to the element that opened it when it closes. The HTML flavour's `modal.js` does the same and removes its Escape listener when the modal closes.
- New tokens with light and dark values: `--newt-spoiler` and `--newt-spoiler-hover` for the hidden chip, and `--newt-code-bg`, `--newt-code-keyword`, `--newt-code-string`, `--newt-code-comment` and `--newt-code-function` for the code block. They replace fixed hex values, so both parts follow a light theme and token overrides. `newtui init` leaves a stylesheet that already holds the tokens untouched, so an existing project adds the seven variables by hand; the values for both themes are on the colours page.
