import { rootClasses } from "@/registry/registry-root-classes"

import { findComponent } from "./registry-meta"

/*
 * The source text the component pages show: the demo for the Code tab and the
 * registry file for the Manual installation tab. The component list itself is
 * `registry-meta.ts`, which `blume.config.ts` reads too; this module is
 * Vite-only, because `?raw` globs are.
 *
 * Sources are eager and `?raw`: pages are rendered once at build time, so the
 * text is inlined into the HTML rather than fetched by the reader. The demo
 * loaders live in `registry-client.ts` because islands import those.
 */
export type { ComponentMeta } from "./registry-meta"
export {
  categories,
  COMPONENTS,
  findComponent,
  targetPaths,
} from "./registry-meta"
export { rootClasses }

const reactDemoSources = import.meta.glob<string>(
  "../../../www/registry/bases/newt/examples/*-demo.tsx",
  { query: "?raw", import: "default", eager: true }
)

const vueDemoSources = import.meta.glob<string>(
  "../../../vue/registry/bases/newt/examples/*Demo.vue",
  { query: "?raw", import: "default", eager: true }
)

const reactUiSources = import.meta.glob<string>(
  "../../../www/registry/bases/newt/ui/*.tsx",
  { query: "?raw", import: "default", eager: true }
)

const reactBlockSources = import.meta.glob<string>(
  "../../../www/registry/bases/newt/blocks/**/*.tsx",
  { query: "?raw", import: "default", eager: true }
)

const vueUiSources = import.meta.glob<string>(
  "../../../vue/registry/bases/newt/ui/*/*.{vue,ts}",
  { query: "?raw", import: "default", eager: true }
)

const vueBlockSources = import.meta.glob<string>(
  "../../../vue/registry/bases/newt/blocks/**/*.{vue,ts}",
  { query: "?raw", import: "default", eager: true }
)

function findSource(
  sources: Record<string, string>,
  suffix: string
): string | undefined {
  const path = Object.keys(sources).find((key) => key.endsWith(suffix))
  return path === undefined ? undefined : sources[path]
}

/**
 * The demo's own source — the short file that shows the component in use,
 * which is what the Code tab displays.
 */
export function demoSource(
  framework: "react" | "vue",
  demo: string
): string | undefined {
  return framework === "react"
    ? findSource(reactDemoSources, `/${demo}.tsx`)
    : findSource(vueDemoSources, `/${demo}.vue`)
}

/**
 * A registry UI file's source, for the Manual installation tab. `file` is the
 * React `<name>.tsx` or, for Vue, the `<name>/<File>.vue` pair.
 */
export function uiSource(
  framework: "react" | "vue",
  name: string,
  file?: string
): string | undefined {
  const meta = findComponent(name)
  if (framework === "react") {
    const sources =
      meta?.type === "registry:block" ? reactBlockSources : reactUiSources
    const sourceFile = meta?.reactFiles[0]?.split("/").at(-1) ?? `${name}.tsx`
    return (
      findSource(sources, `/${name}/${sourceFile}`) ??
      findSource(sources, `/${sourceFile}`)
    )
  }
  const sources =
    meta?.type === "registry:block" ? vueBlockSources : vueUiSources
  return findSource(sources, `/${name}/${file}`)
}
