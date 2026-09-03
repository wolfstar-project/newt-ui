import { lazy, type ComponentType, type LazyExoticComponent } from "react"

import { categories } from "@/registry/registry-categories"

/*
 * The docs site has no component list of its own. It reads the same
 * `apps/www/registry` the CLIs publish, so a component that ships without a
 * meta file simply has no page rather than a page that lies about itself.
 */

/** The literal contents of `apps/www/registry/meta/<name>.json`. */
interface RawMeta {
  readonly name: string
  readonly title: string
  readonly description: string
  /* npm packages; absent on the components that need none */
  readonly dependencies?: readonly string[]
  /* sibling registry items; absent on the components that stand alone */
  readonly registryDependencies?: readonly string[]
  readonly vueFiles: readonly string[]
  readonly reactDemo: string
  readonly vueDemo: string
}

/** A meta file joined to the category that lists it. */
export interface ComponentMeta {
  readonly name: string
  readonly title: string
  readonly description: string
  readonly dependencies: readonly string[]
  readonly registryDependencies: readonly string[]
  readonly vueFiles: readonly string[]
  readonly reactDemo: string
  readonly vueDemo: string
  readonly category: string
  readonly categorySlug: string
}

/*
 * Relative, not `@/registry/meta/*.json`: the alias would match too, and Vite
 * resolves a glob pattern before the alias table, so an aliased pattern finds
 * nothing. The three `..` climb from `src/content` to `apps`.
 */
const metaModules = import.meta.glob<{ default: RawMeta }>(
  "../../../www/registry/meta/*.json",
  { eager: true }
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
        title: raw.title,
        description: raw.description,
        dependencies: raw.dependencies ?? [],
        registryDependencies: raw.registryDependencies ?? [],
        vueFiles: raw.vueFiles,
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

/** A React demo, split into its own chunk and fetched on first render. */
export type ReactDemo = LazyExoticComponent<ComponentType>

const demoModules = import.meta.glob<{ default: ComponentType }>(
  "../../../www/registry/default/example/*-demo.tsx"
)

function buildReactDemos(): ReadonlyMap<string, ReactDemo> {
  const demos = new Map<string, ReactDemo>()
  for (const [path, load] of Object.entries(demoModules)) {
    const file = path.slice(path.lastIndexOf("/") + 1)
    demos.set(file.slice(0, file.length - ".tsx".length), lazy(load))
  }
  return demos
}

/** Keyed by the `reactDemo` field of a meta file, e.g. `"button-demo"`. */
export const REACT_DEMOS: ReadonlyMap<string, ReactDemo> = buildReactDemos()

export function reactDemo(name: string): ReactDemo | undefined {
  return REACT_DEMOS.get(name)
}

/**
 * `status-indicator` -> `StatusIndicator` (registry name -> Vue component
 * name). A copy of `apps/vue/app/utils/pascal-case.ts`, which lives inside the
 * Nuxt app and is auto-imported there rather than published.
 */
export function pascalCase(name: string): string {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}
