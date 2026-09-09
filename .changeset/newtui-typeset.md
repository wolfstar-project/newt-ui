---
"newtui": minor
---

New `typeset` item: the styles for rendered markdown, which is the one thing a component library cannot cover with components — what arrives is whatever the renderer emitted, with no classes you chose.

Typeset styles that markup from the outside through three variables: `--typeset-size` is the base every other size is an `em` of, `--typeset-leading` is the line height, and `--typeset-flow` is the space between block children. One rule owns the rhythm — every block child carries the same trailing margin and none carries a leading one — so a paragraph's spacing never depends on what happens to sit above it. Everything else resolves to a `--newt-*` token, which is why a typeset block follows the palette, the light surfaces and a preset without knowing they exist.

Three presets cover the surfaces this library renders into: `typeset-docs` for long-form reading, `typeset-chat` for conversation, `typeset-article` for editorial text. `typeset-measure` caps the line length, `not-typeset` takes an island of interface back out of the rhythm, and a table scrolls sideways below the narrow breakpoint rather than widening the page.

Every selector is wrapped in `:where()`, so a utility class or a component class overrides it without `!important`, and the whole stylesheet is written in logical properties, so `dir="rtl"` is the entire RTL story.

`newtui add typeset` appends the stylesheet and writes a thin `Typeset` wrapper for React or Vue; the plain flavour is the two class names on their own.
