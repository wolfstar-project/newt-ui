import { readdirSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

import { z } from "zod"

/*
 * Relative rather than through the `@/registry` alias: `blume.config.ts`
 * imports this file before the Vite alias table exists.
 */
import { categories } from "../../../www/registry/registry-categories"

/*
 * The docs site has no component list of its own. It reads the same
 * `apps/www/registry/meta` the CLIs publish, so a component that ships without
 * a meta file simply has no page rather than a page that lies about itself.
 *
 * Plain `node:fs` rather than `import.meta.glob`, because two readers need it:
 * the Astro components, which Vite could serve, and `blume.config.ts`, which
 * Blume loads in Node before Vite exists — the sidebar and the Markdown
 * serialisers are built there from the same list.
 *
 * Anchored on the working directory, not on `import.meta.url`: every `blume`
 * command runs from `apps/docs`, and the bundle Astro writes this module into
 * sits at a different depth from the source file.
 */
const META_DIR = resolve(process.cwd(), "../www/registry/meta/")

/** The literal contents of `apps/www/registry/meta/<name>.json`. */
const RawMeta = z.object({
  name: z.string(),
  type: z.enum(["registry:ui", "registry:block"]).default("registry:ui"),
  title: z.string(),
  description: z.string(),
  /* npm packages; absent on the components that need none */
  dependencies: z.array(z.string()).default([]),
  /* sibling registry items; absent on the components that stand alone */
  registryDependencies: z.array(z.string()).default([]),
  vueFiles: z.array(z.string()),
  reactFiles: z.array(z.string()).optional(),
  reactDemo: z.string(),
  vueDemo: z.string(),
})

type RawMeta = z.infer<typeof RawMeta>

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

function readMeta(): ReadonlyMap<string, RawMeta> {
  const files = new Map<string, RawMeta>()
  for (const file of readdirSync(META_DIR)) {
    if (!file.endsWith(".json")) continue
    /* A malformed meta file fails the build here, naming the file. */
    const raw = RawMeta.parse(
      JSON.parse(readFileSync(resolve(META_DIR, file), "utf8"))
    )
    files.set(raw.name, raw)
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
        ...raw,
        reactFiles: raw.reactFiles ?? [`ui/${raw.name}.tsx`],
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

export { categories }

/** Where `newtui add` writes each of a component's files, per framework. */
export function targetPaths(
  framework: "react" | "vue",
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
