import type { Component } from "vue"

/** Resolves the single file component a `*Demo.vue` file default-exports. */
export type VueDemoLoader = () => Promise<{ readonly default: Component }>

/*
 * Every entry is a dynamic import, so Vue and its demos reach a reader only
 * once that reader asks for the Vue side of a page. The three `..` climb from
 * `src/vue` to `apps`; the pattern stays relative because the `@/lib/registry`
 * alias matches this path too and Vite resolves globs before aliases.
 */
const demoModules = import.meta.glob<{ readonly default: Component }>(
  "../../../vue/app/lib/registry/default/example/*Demo.vue"
)

function buildVueDemos(): ReadonlyMap<string, VueDemoLoader> {
  const demos = new Map<string, VueDemoLoader>()
  for (const [path, load] of Object.entries(demoModules)) {
    const file = path.slice(path.lastIndexOf("/") + 1)
    demos.set(file.slice(0, file.length - ".vue".length), load)
  }
  return demos
}

/*
 * Built once at module scope, so a loader keeps the same identity across
 * renders. The island that mounts a demo depends on it in an effect, and a
 * fresh closure per render would tear the component down and remount it on
 * every pass.
 */
export const VUE_DEMOS: ReadonlyMap<string, VueDemoLoader> = buildVueDemos()

/** Keyed by the `vueDemo` field of a meta file, e.g. `"ButtonDemo"`. */
export function vueDemo(name: string): VueDemoLoader | undefined {
  return VUE_DEMOS.get(name)
}
