---
name: newt-ui-components
description: Use when adding, porting, or restyling a newt/ui component in HTML/CSS, React, or Vue, including its demo and docs.
---

# newt/ui components

A component is done when it exists in all three forms and they look identical.

## The three forms

1. **HTML/CSS** — `packages/newtui/registry/html/components/<name>.{css,html,js}`.
   BEM-lite classes prefixed `newt-`: `.newt-block`, `.newt-block__element`,
   `.newt-block--variant`. This is the visual spec.
2. **React** — `apps/www/registry/default/ui/<name>.tsx`. `cva` for variants,
   `cn` for merging, `React.forwardRef` + `displayName`, compound exports for
   sub-elements (`Embed`, `EmbedTitle`, `EmbedField`, …), and the `*Variants`
   object exported alongside. `"use client"` only when it uses hooks or events.
3. **Vue** — `apps/vue/app/lib/registry/default/ui/<name>/`: one `.vue` per
   sub-component (`<script setup lang="ts">`), plus `index.ts` re-exporting
   them and defining the `cva` variants and `VariantProps` types.

Plus, every time: a demo (`example/<name>-demo.tsx` /
`example/<Pascal>Demo.vue`), docs (`content/docs/components/<name>.mdx` /
`content/docs/components/<name>.md`), `registry/meta/<name>.json`, and an
entry in `registry-categories.ts` (both copies).

## Rules

- Variant modifiers describe **state or intent**, never appearance:
  `--danger`, `--success`, `--online`. Not `--red`, `--green`.
- Tokens only. Every colour, radius, font, shadow, easing, and duration comes
  from a `--newt-*` variable, reached through the Tailwind utility
  (`bg-newt-bg-elevated`, `text-newt-text-muted`, `rounded-md`,
  `shadow-elevation-high`, `ease-newt`, `duration-fast`). If a value has no
  token, add the token; do not inline a hex.
- Anything the utilities cannot express (odd pixel values, keyframes,
  gradients) goes in a Tailwind arbitrary value or an inline
  `style={{ … var(--newt-*) }}` — still referencing the token.
- The React and Vue versions expose the same prop names, the same variant
  names, and the same defaults. A user switching frameworks should only change
  the import.
- Behaviour from the original `.js` file is ported to React state / Vue refs.
  Keep the escape-key and overlay-click handling, the auto-dismiss timers, and
  the copy-to-clipboard feedback.
- Keep the ARIA roles and attributes from the original markup, and keep focus
  states visible. Presence dots are `role="status"`; dialogs are
  `role="dialog"` with a label.
- Class names in the React/Vue sources are Tailwind utilities only — the
  `newt-` BEM names belong to the HTML distribution, not to the framework
  ports (`data-*` attributes for state are fine).

## Workflow

1. Read the HTML/CSS source and its demo markup before writing anything.
2. Port to React and Vue, matching the CSS rule by rule.
3. Write both demos from the original `.html` example.
4. Write both docs pages.
5. Add `meta/<name>.json` and the category entry.
6. `node scripts/gen-registry.mjs`, then `pnpm typecheck && pnpm build`.
7. Render it. A component that only typechecks has not been verified.
