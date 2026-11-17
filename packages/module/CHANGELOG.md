# @newtui/nuxt

## 2.0.1

### Patch Changes

- [#103](https://github.com/wolfstar-project/newt-ui/pull/103) [`baa4b49`](https://github.com/wolfstar-project/newt-ui/commit/baa4b4998c49e1815e1a6b217e294b56e8cff66f) - fix(deps): update all non-major dependencies Thanks [@renovate](https://github.com/apps/renovate)!

## 2.0.0

### Major Changes

- [#95](https://github.com/wolfstar-project/newt-ui/pull/95) [`975a2de`](https://github.com/wolfstar-project/newt-ui/commit/975a2de6c813071d2c6924e9b51227343bdfa9b1) - Register `components/ui` before Nuxt scans `components/`. Nuxt gives a file to the first directory that scans it, so the module registered nothing: components stayed `<UiButton />`, and each `index.ts` barrel caused a `NUXT_B3011` duplicate name warning. The components are now `<Button />` (or `<NewtButton />` with `prefix: "Newt"`), as the documentation says, and the warnings are gone. If your templates use the `Ui` names, rename them or remove the module.

### Patch Changes

- [#106](https://github.com/wolfstar-project/newt-ui/pull/106) [`a6123f8`](https://github.com/wolfstar-project/newt-ui/commit/a6123f84e6c6347d701b4854bfaa2f6b092622f0) - The token stylesheet of the module now declares `--newt-streaming` and `--newt-text-message`. The streaming dot of `status-indicator` keeps its colour, and message text in `message-group` takes its own colour. No change is needed in your project.

## 1.0.2

### Patch Changes

- [#29](https://github.com/wolfstar-project/newt-ui/pull/29) [`c509c7e`](https://github.com/wolfstar-project/newt-ui/commit/c509c7e6c5b2e8e2eff42947053e7e3096f62410) - fix(deps): update all non-major dependencies Thanks [@renovate](https://github.com/apps/renovate)!

## 1.0.1

### Patch Changes

- [#24](https://github.com/wolfstar-project/newt-ui/pull/24) [`dc0b233`](https://github.com/wolfstar-project/newt-ui/commit/dc0b233e13e524b76f5228e77322ad4b1032009e) - Update dependencies. `newtui` follows the narrower cancel type in `@clack/prompts` 1.8, and `@newtui/nuxt` annotates its default export so the declaration build no longer depends on an `@nuxt/schema` internal type.

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
