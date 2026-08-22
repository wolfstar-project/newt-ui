declare module "*.vue" {
  import type { DefineComponent } from "vue"
  // Generic ambient shim for an arbitrary `.vue` SFC — every concrete
  // component overrides these via its own `defineProps`/`defineEmits`, so
  // `{}` (no known props/bindings) is Vue's own documented default here,
  // not an application dictionary that should carry a concrete value type.
  const component: DefineComponent<{}, {}, any>
  export default component
}
