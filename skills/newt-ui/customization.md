# Customising newt/ui

## Override a token, not a component

The library's whole surface is `--newt-*` custom properties. Changing one
reaches every component that reads it, in all three flavours, at once.

```css
:root {
  --newt-brand: #7a5af8;
  --newt-brand-hover: #6b4ce0;
  --newt-brand-active: #5a3fc0;
}
```

Scoping it to a subtree changes only that subtree:

```css
.support-panel {
  --newt-brand: var(--newt-online);
}
```

## Do not edit an installed component to restyle it

Editing `components/ui/button.tsx` to change a colour costs the next
`newtui diff` and the next upgrade. Pass a `className` — it is merged, not
replaced — or override a token on a wrapper.

## The light palette

A light surface set ships alongside the dark one and is opt-in. It overrides the
same token names, which is why no component has to know a palette changed.

```html
<html data-newt-theme="light"></html>
```

`.newt-light` on any wrapper does the same for a subtree. Set `color-scheme`
alongside it so form controls and scrollbars follow.

## Tailwind

The token layer is projected into both majors: a preset for v3, an `@theme`
block for v4. `init` writes whichever the project needs. Either way the
utilities are the same — `bg-newt-brand`, `text-newt-text-muted`,
`border-newt-border`, `rounded-md`, `shadow-elevation-high`, `duration-fast`,
`ease-newt`.

## A preset is the short way to the same place

`newtui apply --preset nt1.…` writes the brand hue, radius scale, font stack,
surface mode and direction as one block of `--newt-*` overrides after the
tokens. It is the same override you would write by hand — the builder at
<https://newtui.dev/create> just spares you the arithmetic on the hover and
active steps. Editing that block afterwards is fine; it is your file.

## Rendered markdown is Typeset, not a component

Markdown a renderer produced has no classes you chose, so styling it with
components is not on offer. `newtui add typeset` adds a stylesheet and a
wrapper: put `typeset` plus one of `typeset-docs`, `typeset-chat` or
`typeset-article` on the container and the markup inside follows the library's
rhythm. Three variables tune it — `--typeset-size`, `--typeset-leading`,
`--typeset-flow` — and `not-typeset` takes an island of interface back out.

## Adding a token

If a value has no token, add the token rather than the value. In this
repository that means editing `packages/cli/registry/html/tokens.css` first
and rerunning `node scripts/gen-registry.mjs`. In a consumer project it means
declaring your own custom property alongside the `--newt-*` block, not a literal
in a component.
