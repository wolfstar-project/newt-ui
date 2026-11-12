---
"newtui": minor
---

Presets carry three more choices from newt/create: the base colour the surfaces are mixed from (`slate`, `neutral`, `stone`, `ink`), a heading font of its own, and the elevation shadows (`soft`, `flat`, `deep`). The radius scale gains `none` and `xl`, and the font stacks gain `serif` and `rounded`. `init --preset`, `apply --preset` and `preset css` write the matching `--newt-*` overrides, including the light surface set for a base colour. Codes made before this release decode and encode exactly as they did.
