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
 * The markdown twin. `index` keeps its own name rather than becoming
 * `/docs.md`, so the route stays inside the `/docs/` directory alongside
 * every other twin.
 */
export function markdownPathFor(id: string): string {
  return `/docs/${id}.md`
}
