---
"newtui": minor
---

Presets carry three more choices from newt/create: the base colour the surfaces are mixed from (`slate`, `neutral`, `stone`, `ink`), a heading font of its own, and the elevation shadows (`soft`, `flat`, `deep`). The radius scale gains `none` and `xl`, and the font stacks gain `serif` and `rounded`. `init --preset`, `apply --preset` and `preset css` write the matching `--newt-*` overrides, including both surface sets for a base colour: the light one in `:root` and the dark one under the project's dark selector, the way `init` lays the tokens out (`preset css` prints the other layout for an `html` preset, dark in `:root` and light under `.newt-light`, as `tokens.css` does; `init` and `apply` always write the installed one). Codes made before this release decode and encode exactly as they did.
