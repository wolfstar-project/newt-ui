import { existsSync } from "node:fs"
import { resolve } from "node:path"

import { htmlExample } from "./html-registry"
import { findComponent, type ComponentMeta } from "./registry-meta"
import { SITE } from "./site"

/*
 * Where a documentation page comes from: the file it is written in, and — on
 * a component page — the files the component itself lives in. The page header
 * and the right rail both link there, and neither is handed more than a
 * route, so the lookups are here once.
 */
const COMPONENTS_PREFIX = "/docs/components/"

/**
 * `/docs/forms` → `content/docs/forms.mdx` or `content/docs/forms/index.mdx`.
 * Looked up rather than derived, because a folder's index page and a single
 * page differ only on disk; a route with no file behind it — a generated
 * index — has no source.
 */
export function pageSourcePath(route: string): string | undefined {
  const stem = route.replace(/^\/+|\/+$/g, "")
  return [`content/${stem}.mdx`, `content/${stem}/index.mdx`].find(
    (candidate) => existsSync(resolve(process.cwd(), candidate))
  )
}

/** The registry item a component page documents, if the route is one. */
export function routeComponent(route: string): ComponentMeta | undefined {
  const path = route.replace(/\/$/, "")
  return path.startsWith(COMPONENTS_PREFIX)
    ? findComponent(path.slice(COMPONENTS_PREFIX.length))
    : undefined
}

export interface ComponentSource {
  readonly id: "react" | "vue" | "html"
  readonly label: string
  readonly href: string
}

/** One link per flavour to the file a reader would otherwise go and find. */
export function componentSources(
  meta: ComponentMeta
): readonly ComponentSource[] {
  const kind = meta.type === "registry:block" ? "blocks" : "ui"
  return [
    {
      id: "react",
      label: "React",
      href: `${SITE.github}/blob/main/apps/www/registry/bases/newt/${meta.reactFiles[0]}`,
    },
    {
      id: "vue",
      label: "Vue",
      href: `${SITE.github}/tree/main/apps/vue/registry/bases/newt/${kind}/${meta.name}`,
    },
    ...(htmlExample(meta.name) === undefined
      ? []
      : [
          {
            id: "html" as const,
            label: "HTML & CSS",
            href: `${SITE.github}/blob/main/packages/cli/registry/html/components/${meta.name}.css`,
          },
        ]),
  ]
}
