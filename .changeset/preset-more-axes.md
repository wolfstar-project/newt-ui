---
"newtui": minor
---

Presets carry three more choices from newt/create: the base colour the surfaces are mixed from (`slate`, `neutral`, `stone`, `ink`), a heading font of its own, and the elevation shadows (`soft`, `flat`, `deep`). The radius scale gains `none` and `xl`, and the font stacks gain `serif` and `rounded`. `init --preset`, `apply --preset` and `preset css` write the matching `--newt-*` overrides, including both surface sets for a base colour: the light one in `:root` and the dark one under the project's dark selector, the way `init` lays the tokens out (a preset for the `html` target keeps the dark set in `:root` and the light one under `.newt-light`, as `tokens.css` does). Codes made before this release decode and encode exactly as they did.
