import { rootClasses } from "@/registry/registry-root-classes"

import {
  buildComponentPrompt,
  registryClosure,
  type PromptItem,
} from "./component-prompt"
import { findComponent, targetPaths, type ComponentMeta } from "./registry-meta"
import { SITE } from "./site"

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
export { categories, COMPONENTS, findComponent } from "./registry-meta"
export { rootClasses }

const reactDemoSources = import.meta.glob<string>(
  "../../../www/registry/bases/newt/examples/*-demo.tsx",
  { query: "?raw", import: "default", eager: true }
)

const vueDemoSources = import.meta.glob<string>(
  "../../../vue/registry/bases/newt/examples/*Demo.vue",
  { query: "?raw", import: "default", eager: true }
)

const reactSources = import.meta.glob<string>(
  "../../../www/registry/bases/newt/{ui,blocks}/**/*.{ts,tsx}",
  { query: "?raw", import: "default", eager: true }
)

const vueSources = import.meta.glob<string>(
  "../../../vue/registry/bases/newt/{ui,blocks}/**/*.{vue,ts}",
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

/** One file of a registry item, at the path `newtui add` writes it to. */
export interface RegistryFile {
  readonly path: string
  /** `undefined` when the meta file names a source that does not exist. */
  readonly source: string | undefined
}

/**
 * Every file a registry item installs, for the Manual installation tab and the
 * copyable prompt. React lists its files in `reactFiles` (`ui/markdown.tsx`,
 * `ui/markdown-syntax.ts`); Vue names them inside the item's own directory.
 */
export function registryFiles(
  framework: "react" | "vue",
  meta: ComponentMeta
): readonly RegistryFile[] {
  const paths = targetPaths(framework, meta)
  if (framework === "react") {
    return meta.reactFiles.map((file, index) => ({
      path: paths[index] ?? file,
      source: findSource(reactSources, `/bases/newt/${file}`),
    }))
  }
  const root = meta.type === "registry:block" ? "blocks" : "ui"
  return meta.vueFiles.map((file, index) => ({
    path: paths[index] ?? file,
    source: findSource(vueSources, `/bases/newt/${root}/${meta.name}/${file}`),
  }))
}

function promptItem(
  framework: "react" | "vue",
  meta: ComponentMeta
): PromptItem {
  return {
    name: meta.name,
    title: meta.title,
    files: registryFiles(framework, meta).map(({ path, source }) => {
      /* A meta file naming a missing source is a registry bug; fail loudly. */
      if (source === undefined) {
        throw new Error(`${meta.name}: no ${framework} source for ${path}.`)
      }
      return { path, source }
    }),
  }
}

/**
 * The "copy prompt" text of a component page: the component, every registry
 * item it builds on and the npm packages all of them need, for an assistant
 * to install without the CLI.
 */
export function componentPrompt(
  framework: "react" | "vue",
  meta: ComponentMeta
): string {
  const dependencies = registryClosure(
    meta.name,
    (name) => findComponent(name)?.registryDependencies,
    findComponent
  )
  const packages = [
    ...new Set([meta, ...dependencies].flatMap((item) => item.dependencies)),
  ]
  return buildComponentPrompt({
    framework,
    item: { ...promptItem(framework, meta), description: meta.description },
    dependencies: dependencies.map((item) => promptItem(framework, item)),
    packages,
    siteUrl: SITE.url,
    siteName: SITE.name,
    utilsAlias: SITE.utilsAlias,
  })
}
