import type { HeadConfig } from "@prosefly/astro-theme-lotus"
import { pwaAssetsHead } from "virtual:pwa-assets/head"
import { pwaInfo } from "virtual:pwa-info"

import { ogImageUrl } from "./og-card"
import { SITE } from "./site"

/*
 * Everything the theme does not put in `<head>` and this site needs there.
 *
 * Lotus emits `<title>`, `description`, `generator` and the favicons, and
 * stops. It publishes no canonical link and none of the Open Graph basics —
 * and `astro-takumi` refuses to render a card without `og:title`, `og:url` and
 * `og:type`, so a page that forgets them fails the build rather than shipping
 * a link that unfurls into nothing.
 *
 * Because every route now owns these tags, they are written once here rather
 * than nine times across the site.
 */

export interface HeadInput {
  /** The page title, already without the ` · newt/ui` suffix. */
  readonly title: string
  readonly description?: string
  /** `Astro.url.pathname`. */
  readonly pathname: string
  /** `Astro.site`. */
  readonly site: URL | undefined
  /** The page's markdown twin, when it has one. */
  readonly markdownPath?: string
  /** Extra tags for a single page, appended last. */
  readonly extra?: HeadConfig
}

/*
 * The icons the assets generator rasterised and the manifest that names them.
 * They used to be written by `Base.astro`; the theme's `BaseLayout` emits its
 * own favicon config and nothing else, so a page that does not say this is a
 * page the browser will not offer to install.
 */
function pwaTags(): HeadConfig {
  const tags: HeadConfig = []

  if (pwaAssetsHead.themeColor) {
    tags.push({
      tag: "meta",
      attrs: {
        name: "theme-color",
        content: pwaAssetsHead.themeColor.content,
      },
    })
  }

  for (const link of pwaAssetsHead.links) {
    /*
     * The generator types a link as `Record<string, string>`, which is the
     * attribute record a head entry already takes; the copy is here so the
     * entry owns its object rather than aliasing the plugin's.
     */
    tags.push({ tag: "link", attrs: { ...link } })
  }

  const manifest = pwaInfo?.webManifest
  if (manifest) {
    const attrs: NonNullable<HeadConfig[number]["attrs"]> = {
      rel: "manifest",
      href: manifest.href,
    }
    if (manifest.useCredentials) {
      attrs.crossorigin = "use-credentials"
    }
    tags.push({ tag: "link", attrs })
  }

  return tags
}

export function buildHead(input: HeadInput): HeadConfig {
  const { title, pathname, site, markdownPath, extra = [] } = input
  const description = input.description ?? SITE.tagline
  const fullTitle = title === SITE.name ? title : `${title} · ${SITE.name}`
  const canonical = new URL(pathname, site).href
  const image = ogImageUrl(pathname, site)
  const alt = `${fullTitle} — ${SITE.tagline}`

  return [
    /*
     * The theme spells the title `Title - Name`; this site has always spelled
     * it `Title · newt/ui`, and that string is what the OG card, the search
     * index and every bookmark already say. `mergeHead` drops the theme's own
     * `<title>` when the page supplies one, so saying it here is enough.
     */
    { tag: "title", content: fullTitle },
    { tag: "link", attrs: { rel: "canonical", href: canonical } },
    { tag: "link", attrs: { rel: "sitemap", href: "/sitemap-index.xml" } },
    ...(markdownPath === undefined
      ? []
      : [
          {
            tag: "link",
            attrs: {
              rel: "alternate",
              type: "text/markdown",
              href: markdownPath,
              title: "Markdown",
            },
          },
        ]),
    { tag: "meta", attrs: { property: "og:title", content: fullTitle } },
    {
      tag: "meta",
      attrs: { property: "og:description", content: description },
    },
    { tag: "meta", attrs: { property: "og:type", content: "website" } },
    { tag: "meta", attrs: { property: "og:url", content: canonical } },
    { tag: "meta", attrs: { property: "og:site_name", content: SITE.name } },
    { tag: "meta", attrs: { property: "og:locale", content: "en" } },
    { tag: "meta", attrs: { property: "og:image", content: image } },
    { tag: "meta", attrs: { property: "og:image:alt", content: alt } },
    {
      tag: "meta",
      attrs: { name: "twitter:card", content: "summary_large_image" },
    },
    { tag: "meta", attrs: { name: "twitter:title", content: fullTitle } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: description },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: image } },
    { tag: "meta", attrs: { name: "twitter:image:alt", content: alt } },
    ...pwaTags(),
    ...extra,
  ]
}
