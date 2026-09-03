/// <reference types="vite/client" />

/*
 * The React side of the site loads a single file component through a dynamic
 * import and mounts it, so the checker only needs to know the module resolves.
 * `vue-tsc` checks the components themselves.
 */
declare module "*.vue" {
  import type { DefineComponent } from "vue"

  const component: DefineComponent
  export default component
}
