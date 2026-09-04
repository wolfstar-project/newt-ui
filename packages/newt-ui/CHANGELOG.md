# @newtui/react

## 2.0.0

### Major Changes

- 546bd96: Unify the two CLIs into a single unscoped `newtui` package, and add `framework` to registry items.

  `@newtui/react` and `@newtui/vue` were the same CLI twice, differing only in the paths they wrote and the registry they read. They are now one package, `newtui`, which decides between React and Vue from `framework` in `components.json`:

  ```bash
  npx newtui init          # detects React or Vue, or pass --framework react|vue
  npx newtui add button
  ```

  Both scoped packages still install and still work — each now ships a wrapper that prints a deprecation notice and forwards to `newtui`. They are removed in the next major.

  An existing `components.json` needs no changes. It is migrated on read:

  - the old Vue `framework: "nuxt" | "vite"` becomes `bundler`, and `framework` becomes `"vue"`
  - the old React `tsx` is read as `typescript`
  - a config with neither field is matched to a framework by the aliases it declares

  Registry items now carry `framework: "react" | "vue"`, stamped by each app's registry build and validated by `registryItemSchema`, so a single item JSON says which framework it targets. The two registries keep their existing urls (`/r` and `/vue/r`), so nothing consuming them has to change.

### Patch Changes

- Updated dependencies [546bd96]
  - newtui@2.0.0

## 1.0.0

### Major Changes

- 81c01a0: Rename the published packages to the `@newtui` npm scope:

  - `@wolfstar/newt-ui` is now `@newtui/react`
  - `@wolfstar/newt-ui-vue` is now `@newtui/vue`
  - `@wolfstar/nuxt-newt-ui` is now `@newtui/nuxt`
  - the planned HTML package is now `@newtui/html`

  Update your dependencies and imports to the new names. The CLI binaries
  (`newt-ui`, `newt-ui-vue`, `newt-ui-html`) are unchanged.

## 0.3.0

### Minor Changes

- 5609259: Move the published packages to the `@wolfstar` npm scope: `newt-ui` is now
  `@wolfstar/newt-ui`, `newt-ui-vue` is now `@wolfstar/newt-ui-vue`, and
  `@newt-devs/nuxt` is now `@wolfstar/nuxt-newt-ui`. The `newt-ui`,
  `newt-ui-vue`, and `newt-ui-html` binaries keep their names, so only the
  `npx`/install target changes:

  ```bash
  npx @wolfstar/newt-ui@latest init
  npx @wolfstar/newt-ui-vue@latest init
  npx @wolfstar/newt-ui@latest --legacy init
  ```

  Package metadata now points at `wolfstar-project/newt-ui` and is licensed
  under Apache-2.0, matching the repository license.
