import type { ComponentType } from "react"
import type { Component } from "vue"

/*
 * The demo loaders only. Islands import this file rather than `registry.ts`,
 * which also holds eager `?raw` source maps and the meta model: pulling those
 * into a client bundle would ship every demo's text to every reader.
 *
 * Patterns stay relative. Vite resolves a glob before the alias table, so an
 * aliased pattern matches nothing; the three `..` climb from `src/lib` to
 * `apps`.
 */

/** Resolves the module a `*-demo.tsx` file default-exports. */
export type ReactDemoLoader = () => Promise<{
  readonly default: ComponentType
}>

/** Resolves the single file component a `*Demo.vue` file default-exports. */
export type VueDemoLoader = () => Promise<{ readonly default: Component }>

const reactModules = import.meta.glob<{ readonly default: ComponentType }>(
  "../../../www/registry/default/example/*-demo.tsx"
)

const vueModules = import.meta.glob<{ readonly default: Component }>(
  "../../../vue/app/lib/registry/default/example/*Demo.vue"
)

function byBasename<T>(
  modules: Record<string, T>,
  extension: string
): ReadonlyMap<string, T> {
  const loaders = new Map<string, T>()
  for (const [path, load] of Object.entries(modules)) {
    const file = path.slice(path.lastIndexOf("/") + 1)
    loaders.set(file.slice(0, file.length - extension.length), load)
  }
  return loaders
}

/*
 * Built once at module scope so a loader keeps its identity across renders:
 * a fresh closure per render would remount the demo on every pass.
 */

/** Keyed by the `reactDemo` field of a meta file, e.g. `"button-demo"`. */
export const reactDemos: ReadonlyMap<string, ReactDemoLoader> = byBasename(
  reactModules,
  ".tsx"
)

/** Keyed by the `vueDemo` field of a meta file, e.g. `"ButtonDemo"`. */
export const vueDemos: ReadonlyMap<string, VueDemoLoader> = byBasename(
  vueModules,
  ".vue"
)
