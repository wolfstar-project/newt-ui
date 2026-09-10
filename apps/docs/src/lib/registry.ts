import { categories } from "@/registry/registry-categories"
import { rootClasses } from "@/registry/registry-root-classes"

import type { Framework } from "../stores/framework"

/*
 * The docs site has no component list of its own. It reads the same
 * `apps/www/registry` the CLIs publish, so a component that ships without a
 * meta file simply has no page rather than a page that lies about itself.
 *
 * This module runs at build time only. The demo loaders live in
 * `registry-client.ts` because islands import those.
 */

/** The literal contents of `apps/www/registry/meta/<name>.json`. */
interface RawMeta {
  readonly name: string
  readonly type?: "registry:ui" | "registry:block"
  readonly title: string
  readonly description: string
  /* npm packages; absent on the components that need none */
  readonly dependencies?: readonly string[]
  /* sibling registry items; absent on the components that stand alone */
  readonly registryDependencies?: readonly string[]
  readonly vueFiles: readonly string[]
  readonly reactFiles?: readonly string[]
  readonly reactDemo: string
  readonly vueDemo: string
}

/** A meta file joined to the category that lists it. */
export interface ComponentMeta {
  readonly name: string
  readonly type: "registry:ui" | "registry:block"
  readonly title: string
  readonly description: string
  readonly dependencies: readonly string[]
  readonly registryDependencies: readonly string[]
  readonly vueFiles: readonly string[]
  readonly reactFiles: readonly string[]
  readonly reactDemo: string
  readonly vueDemo: string
  readonly category: string
  readonly categorySlug: string
}

const metaModules = import.meta.glob<{ default: RawMeta }>(
  "../../../www/registry/meta/*.json",
  {
    eager: true,
  }
)

function readMeta(): ReadonlyMap<string, RawMeta> {
  const files = new Map<string, RawMeta>()
  for (const module of Object.values(metaModules)) {
    files.set(module.default.name, module.default)
  }
  return files
}

function buildComponents(): readonly ComponentMeta[] {
  const files = readMeta()
  const components: ComponentMeta[] = []
  for (const category of categories) {
    for (const name of category.components) {
      const raw = files.get(name)
      /* listed in the taxonomy but not yet written up — skip it */
      if (raw === undefined) continue
      components.push({
        name: raw.name,
        type: raw.type ?? "registry:ui",
        title: raw.title,
        description: raw.description,
        dependencies: raw.dependencies ?? [],
        registryDependencies: raw.registryDependencies ?? [],
        vueFiles: raw.vueFiles,
        reactFiles: raw.reactFiles ?? [`ui/${raw.name}.tsx`],
        reactDemo: raw.reactDemo,
        vueDemo: raw.vueDemo,
        category: category.label,
        categorySlug: category.slug,
      })
    }
  }
  return components
}

/*
 * Ordered by `categories`, so the sidebar, the overview grid and the previous
 * and next links all walk the same sequence. A meta file no category claims is
 * left out on purpose: it has no place to appear.
 */
export const COMPONENTS: readonly ComponentMeta[] = buildComponents()

export function findComponent(name: string): ComponentMeta | undefined {
  return COMPONENTS.find((component) => component.name === name)
}

export { categories, rootClasses }

/*
 * Sources are eager and `?raw`: pages are rendered once at build time, so the
 * text is inlined into the HTML rather than fetched by the reader.
 */
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
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

const reactBlockSources = import.meta.glob<string>(
  "../../../www/registry/bases/newt/blocks/**/*.tsx",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
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
  framework: Framework,
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
  framework: Framework,
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

/** Where `newtui add` writes each of a component's files, per framework. */
export function targetPaths(
  framework: Framework,
  meta: ComponentMeta
): readonly string[] {
  if (meta.type === "registry:block") {
    return framework === "react"
      ? meta.reactFiles.map((file) => `components/${file.split("/").at(-1)}`)
      : meta.vueFiles.map((file) => `components/${meta.name}/${file}`)
  }
  return framework === "react"
    ? [`components/ui/${meta.name}.tsx`]
    : meta.vueFiles.map((file) => `components/ui/${meta.name}/${file}`)
}
