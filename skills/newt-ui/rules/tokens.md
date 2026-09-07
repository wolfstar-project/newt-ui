# Tokens, never literals

Every colour, radius, shadow, font and duration in a newt/ui interface is a
`--newt-*` custom property. A literal is the one way to end up with a component
that no longer follows the rest of the system — and it breaks the light palette,
which works by overriding the same names.

## The vocabulary

| Group     | Tokens                                                                                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Surfaces  | `--newt-bg-base`, `--newt-bg-surface`, `--newt-bg-elevated`, `--newt-bg-floating`, `--newt-bg-input`, `--newt-bg-hover`, `--newt-bg-active`, `--newt-border` |
| Text      | `--newt-text-primary`, `--newt-text-secondary`, `--newt-text-muted`, `--newt-text-link`                                                                      |
| Brand     | `--newt-brand`, `--newt-brand-hover`, `--newt-brand-active`                                                                                                  |
| Status    | `--newt-online`, `--newt-idle`, `--newt-dnd`, `--newt-offline`, `--newt-danger`                                                                              |
| Shape     | `--newt-radius-sm                                                                                                                                            | md  | lg  | full` |
| Type      | `--newt-font-sans`, `--newt-font-mono`, `--newt-font-display`                                                                                                |
| Elevation | `--newt-shadow-elevation-low`, `--newt-shadow-elevation-high`                                                                                                |
| Motion    | `--newt-duration-fast`, `--newt-duration-base`, `--newt-ease`                                                                                                |

The Tailwind utilities are the same names: `bg-newt-brand`,
`text-newt-text-muted`, `border-newt-border`, `rounded-md`,
`shadow-elevation-high`, `duration-fast`, `ease-newt`.

## Incorrect

```tsx
<div className="rounded-[8px] bg-[#313338] p-4 text-[#b5bac1]">
  <span className="text-[#23a55a]">Online</span>
</div>
```

Three literals, one of which duplicates `--newt-online`. A project that switches
to the light palette gets a dark card with unreadable text.

## Correct

```tsx
<div className="rounded-md bg-newt-bg-elevated p-4 text-newt-text-secondary">
  <span className="text-newt-online">Online</span>
</div>
```

## Incorrect

```css
.channel-header {
  transition: background-color 150ms ease;
}
```

The library ships no transitions: state is carried by colour, border and shape.

## Correct

```css
.channel-header:hover {
  background: var(--newt-bg-hover);
}
```

If a value you need genuinely has no token, say so and propose the token. Do not
inline the value.
