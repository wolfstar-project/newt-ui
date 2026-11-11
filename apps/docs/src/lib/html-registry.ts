/*
 * The canonical HTML and CSS distribution, read as text. Every component's
 * `<name>.html` is the markup of its reference example and needs no script to
 * paint, which makes it the cheapest honest picture of a component there is:
 * the component index and the home page draw their thumbnails from it instead
 * of mounting seventy islands.
 *
 * Vite-only, like `registry.ts`: `?raw` globs are.
 */
const htmlSources = import.meta.glob<string>(
  "../../../../packages/cli/registry/html/components/*.html",
  { query: "?raw", import: "default", eager: true }
)

/*
 * The examples point at placeholder files (`/avatar.png`, `one.png`) that
 * exist in nobody's project. A thumbnail swaps each image for a tinted box
 * that keeps the element's classes, so its size and shape still come from the
 * component's own stylesheet.
 */
const IMAGE = /<img\b([^>]*)>/g

/**
 * A component's reference markup, or `undefined` for one that only exists as
 * a composition (the blocks). Ids are dropped: a thumbnail is inert, and a
 * page that draws many of them must not repeat one.
 */
export function htmlExample(name: string): string | undefined {
  const path = Object.keys(htmlSources).find((key) =>
    key.endsWith(`/${name}.html`)
  )
  if (path === undefined) return undefined
  return (
    htmlSources[path]
      ?.replace(
        /\s(?:id|for|aria-labelledby|aria-describedby|aria-controls)="[^"]*"/g,
        ""
      )
      .replace(IMAGE, (_tag, attributes: string) => {
        const kept = attributes.replace(/\s(?:src|alt|srcset)="[^"]*"/g, "")
        return `<span data-thumb-image${kept.replace(/\s*\/\s*$/, "")}></span>`
      })
      /*
       * A browser does not paint an open `<dialog>` inside an inert subtree,
       * and a thumbnail is inert. The dialog-based examples are drawn as a
       * plain box that keeps the `open` attribute their stylesheets key on.
       */
      .replace(/<dialog\b/g, "<div data-thumb-dialog")
      .replace(/<\/dialog>/g, "</div>")
      .trim()
  )
}

const cssSources = import.meta.glob<string>(
  "../../../../packages/cli/registry/html/components/*.css",
  { query: "?raw", import: "default", eager: true }
)

const tokenSources = import.meta.glob<string>(
  "../../../../packages/cli/registry/html/tokens.css",
  {
    query: "?raw",
    import: "default",
    eager: true,
  }
)

/** Every custom property `tokens.css` declares. */
const declaredTokens = new Set(
  Object.values(tokenSources).flatMap((css) =>
    [...css.matchAll(/(--newt-[a-z0-9-]+)\s*:/g)].map((match) => match[1])
  )
)

/**
 * Every `--newt-*` token a component's stylesheet reads, in the order it first
 * reads them, kept to the ones `tokens.css` declares: a property a component
 * sets for one instance (a member's name colour, an embed's stripe) is not
 * part of the theme.
 */
export function componentTokens(name: string): readonly string[] {
  const path = Object.keys(cssSources).find((key) =>
    key.endsWith(`/${name}.css`)
  )
  const css = path === undefined ? undefined : cssSources[path]
  if (css === undefined) return []
  const tokens = new Set<string>()
  for (const match of css.matchAll(/var\(\s*(--newt-[a-z0-9-]+)/g)) {
    if (match[1] !== undefined && declaredTokens.has(match[1])) {
      tokens.add(match[1])
    }
  }
  return [...tokens]
}
