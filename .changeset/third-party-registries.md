---
"newtui": minor
---

`add` and `view` accept `@registry/item` and install from third-party registries. A namespace resolves through `registries` in `components.json`, then through the community directory of the project's framework — shadcn/ui's for React, shadcn-vue's for Vue — so `newtui add @magicui/marquee` needs no configuration. On Tailwind v4 the first third-party install also maps shadcn's colour names onto the `--newt-*` tokens.
