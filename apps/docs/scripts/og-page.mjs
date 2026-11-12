import { relative, sep } from "node:path"

/*
 * What a social card says, read back from the page it belongs to. These are
 * the parts of `render-og.mjs` that decide which words go on a card, kept apart
 * from the drawing so a fixture can pin them: a card that silently falls back
 * to the site name, or a page that no card matches, is a build that looks fine
 * and ships the wrong image.
 */

export function decodeEntities(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
}

/** A `<meta property content>` value, or `undefined` when the page has none. */
export function metaContent(html, property) {
  const match = html.match(
    new RegExp(`<meta property="${property}" content="([^"]*)"`)
  )
  return match === null ? undefined : decodeEntities(match[1])
}

/** `dist/og/docs/cli.png` → `/docs/cli`; the home page's card is `index.png`. */
export function routeOf(file, cards) {
  const slug = relative(cards, file).slice(0, -".png".length).split(sep)
  return slug.length === 1 && slug[0] === "index" ? "/" : `/${slug.join("/")}`
}

/** The page's own title: `og:title` without the ` - <site>` Blume appends. */
export function titleOf(ogTitle, siteName) {
  const title = ogTitle ?? siteName
  const suffix = ` - ${siteName}`
  return title.endsWith(suffix) ? title.slice(0, -suffix.length) : title
}

/** Where a page sits, said in a word or two above its title. */
export function eyebrowOf(route, meta, siteName) {
  const component = route.match(/^\/docs\/components\/([^/]+)$/)
  if (component !== null) {
    return meta.get(component[1])?.type === "registry:block"
      ? "Block"
      : "Component"
  }
  if (route === "/") return "React · Vue · HTML & CSS"
  if (route.startsWith("/docs")) return "Documentation"
  if (route.startsWith("/changelog")) return "Changelog"
  if (route.startsWith("/blocks")) return "Blocks"
  return siteName
}
