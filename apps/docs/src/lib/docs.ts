/*
 * A docs entry's id is its path under `src/content/docs` without the
 * extension, which is also the URL after `/docs/`. These two helpers are the
 * single place that mapping is spelled out, so the page route, the markdown
 * twin, `llms.txt` and the copy-page menu can never disagree about where a
 * page lives.
 */

/** `components/button` → `/docs/components/button`; `index` → `/docs`. */
export function pathFor(id: string): string {
  return id === "index" ? "/docs" : `/docs/${id}`
}

/**
 * The other direction: `/docs/components/button` → `components/button`,
 * `/docs` → `index`. Needed where a component is handed a URL and not an
 * entry — the theme's page-actions slot, which is given `pageUrl` and nothing
 * else.
 */
export function slugFromPath(pathname: string): string | undefined {
  if (pathname !== "/docs" && !pathname.startsWith("/docs/")) return undefined
  const rest = pathname.slice("/docs".length).replace(/^\/+|\/+$/g, "")
  return rest === "" ? "index" : rest
}

/**
 * The markdown twin. `index` keeps its own name rather than becoming
 * `/docs.md`, so the route stays inside the `/docs/` directory alongside
 * every other twin.
 */
export function markdownPathFor(id: string): string {
  return `/docs/${id}.md`
}

/** Where a page is written, relative to the repository root. */
export function sourcePathFor(id: string): string {
  return `apps/docs/src/content/docs/${id}.mdx`
}

/**
 * The registry item a page documents, for the pages that document one. Every
 * other page — a guide, an installation path — returns nothing, because there
 * is no item behind it to hand anybody.
 */
export function registryItemFor(id: string): string | undefined {
  const prefix = "components/"
  return id.startsWith(prefix) ? id.slice(prefix.length) : undefined
}
