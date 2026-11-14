---
"@newtui/nuxt": patch
---

Register `components/ui` before Nuxt scans `components/`. Nuxt gives a file to the first directory that scans it, so the module registered nothing: components stayed `<UiButton />`, and each `index.ts` barrel caused a `NUXT_B3011` duplicate name warning. The components are now `<Button />` (or `<NewtButton />` with `prefix: "Newt"`), as the documentation says, and the warnings are gone. If your templates use the `Ui` names, rename them or remove the module.
