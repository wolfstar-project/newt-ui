# @wolfstar/nuxt-newt-ui

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
