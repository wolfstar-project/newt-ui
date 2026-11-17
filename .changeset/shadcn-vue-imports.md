---
"newtui": patch
---

`add` now rewrites `@/registry/bases/newt/...` imports in Vue items. The Vue registry publishes its imports in that form, so the shadcn-vue CLI can install newt/ui items too.

If `add` writes a Vue item with an unresolved `@/registry/bases/newt/ui/...` import, your `newtui` is older than this release. Run `newtui@latest`.
