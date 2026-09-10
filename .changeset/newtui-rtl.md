---
"newtui": minor
---

Every component now uses CSS logical properties, so a right-to-left interface is a `dir` attribute rather than a second stylesheet.

The conversion covers all three flavours — the HTML/CSS spec, the React registry and the Vue registry: `margin-left` becomes `margin-inline-start`, `left:` becomes `inset-inline-start`, `border-top-left-radius` becomes `border-start-start-radius`, and the Tailwind utilities follow the same mapping (`ml→ms`, `pr→pe`, `left-→start-`, `rounded-tl→rounded-ss`, `border-l→border-s`, `text-left→text-start`). A test asserts that no physical spelling comes back.

The one thing CSS cannot express logically is the sign of a sideways transform, so `tokens.css` gains `--newt-dir`, which is `1` normally and `-1` under `[dir="rtl"]`. A component that moves something sideways multiplies by it — the switch thumb in `form-fields` is the worked example.

New `direction` item: `DirectionProvider` sets `dir` on a subtree and exposes it through React context or Vue injection, for the components that have to decide which way is forward rather than which way is left. In the plain HTML build the attribute is the whole feature.

New `newtui migrate rtl [--dry-run]` rewrites components installed before this change, in place, reporting every substitution per file. It is idempotent, and it flags `space-x-*` — which is not direction-safe on Tailwind v3 — rather than converting it silently.
