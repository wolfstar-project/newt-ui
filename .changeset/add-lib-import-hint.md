---
"newtui": patch
---

`add` now prints the right import line for a library item: it names the file under the `lib` alias instead of a path under `components/ui`, and prints nothing for an item that installs no files. This is what `newtui add nuxt-ui-theme`, the new Nuxt UI theme in the Vue registry, relies on.
