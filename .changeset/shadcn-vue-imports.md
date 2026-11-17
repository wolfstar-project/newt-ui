---
"newtui": patch
---

`add` now rewrites `@/registry/bases/newt/...` imports in Vue items. The Vue registry publishes its imports in that form, so the shadcn-vue CLI can install newt/ui items too.
