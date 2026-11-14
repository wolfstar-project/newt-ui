---
"newtui": minor
---

`init` keeps the `index.ts` barrels out of Nuxt's component scan. Nuxt read each barrel as a second component and warned once per component folder (`NUXT_B3011: Two component files resolving to the same name`). In a Nuxt project, `init` now adds a `components` option to `nuxt.config` that ignores the barrels and keeps Nuxt's default directories. The pattern follows the `ui` alias in `components.json`. `init` edits only a config with one multi-line `defineNuxtConfig({` call and no `components` option. In every other case it prints the lines to add. If your project already ran `init`, add the option yourself: see the Nuxt installation guide.
