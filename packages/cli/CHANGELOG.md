# @wolfstar/newt-ui-vue

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
