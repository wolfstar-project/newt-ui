import { createElement, type ReactNode } from "react"

import { SITE } from "./site"

/*
 * The card a link to this site unfurls into, in Slack, Discord, iMessage or a
 * search result. It is rendered at build time by Takumi, once per page.
 *
 * `createElement` rather than JSX: this module is imported by `astro.config.ts`,
 * which Vite loads before the app's own JSX pipeline exists, and a build config
 * that needs a transform to parse is a config that breaks on the next
 * toolchain bump. The tree is small enough that the calls stay readable.
 *
 * The values are the `--newt-*` tokens, spelled out. The renderer has no CSS
 * and no cascade, so it cannot read a custom property — when a token changes,
 * this file is the one other place that has to hear about it.
 */
const BRAND = "#5865f2"
const BG = "#1e1f22"
const SURFACE = "#2b2d31"
const TEXT_PRIMARY = "#f2f3f5"
const TEXT_MUTED = "#949ba4"
const BORDER = "#3f4147"

/**
 * Where Takumi writes this page's card, as an absolute URL.
 *
 * `astro-takumi` ships its own `getImagePath`, but it decides between
 * `<path>.webp` and `<path>/index.webp` from the trailing slash on the URL —
 * and this site is configured with `trailingSlash: "never"`, so every page
 * would claim the first form while the image lands beside `index.html` in the
 * second. The rule below is the one this site's `build.format: "directory"`
 * actually produces. The integration compares the two and fails the build if
 * they disagree, so a mistake here is loud rather than a broken preview.
 */
export function ogImageUrl(pathname: string, site: URL | undefined): string {
  if (site === undefined) {
    throw new Error("`site` must be set in astro.config.ts for Open Graph.")
  }
  const route = pathname.replace(/^\/|\/$/g, "")
  /* Astro emits the error pages as top-level files, not as directories. */
  const file =
    route === ""
      ? "index.webp"
      : route === "404" || route === "500"
        ? `${route}.webp`
        : `${route}/index.webp`
  return new URL(file, site).href
}

export interface OgCardInput {
  readonly title: string
  readonly description?: string
  readonly pathname: string
}

/** A title long enough to wrap three times is a title nobody reads on a card. */
function clamp(text: string, limit: number): string {
  return text.length <= limit ? text : `${text.slice(0, limit - 1).trimEnd()}…`
}

/**
 * The route, as breadcrumbs. `/docs/components/button` reads as
 * `docs / components / button`, which tells a reader where the link goes
 * before they follow it.
 */
function crumbs(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean)
  return parts.length === 0 ? "home" : parts.join("  /  ")
}

export function renderOgCard(input: OgCardInput): ReactNode {
  /* The wordmark sits in the footer of the card, so the title drops it. */
  const heading = input.title.replace(new RegExp(`\\s*·\\s*${SITE.name}$`), "")
  const description =
    input.description === undefined || input.description === SITE.tagline
      ? SITE.tagline
      : input.description

  return createElement(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "72px",
        backgroundColor: BG,
        fontFamily: "Inter",
      },
    },
    /* A brand rule along the top edge, so the card is recognisable at thumbnail size. */
    createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "1200px",
        height: "10px",
        backgroundColor: BRAND,
      },
    }),
    createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: "24px" } },
      createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: "26px",
            color: TEXT_MUTED,
            letterSpacing: "0.02em",
          },
        },
        crumbs(input.pathname)
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: "76px",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: TEXT_PRIMARY,
          },
        },
        clamp(heading, 60)
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: "32px",
            lineHeight: 1.4,
            color: TEXT_MUTED,
          },
        },
        clamp(description, 130)
      )
    ),
    createElement(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: "20px",
          paddingTop: "32px",
          borderTop: `2px solid ${BORDER}`,
        },
      },
      /* The mark, as `pwa-icon.svg` draws it: a blurple tile with a white N. */
      createElement(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            backgroundColor: BRAND,
            color: "#ffffff",
            fontSize: "40px",
            fontWeight: 700,
          },
        },
        "N"
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            fontSize: "34px",
            fontWeight: 700,
            color: TEXT_PRIMARY,
          },
        },
        SITE.name
      ),
      createElement(
        "div",
        {
          style: {
            display: "flex",
            marginLeft: "auto",
            padding: "10px 20px",
            borderRadius: "999px",
            backgroundColor: SURFACE,
            fontSize: "24px",
            color: TEXT_MUTED,
          },
        },
        SITE.url.replace("https://", "")
      )
    )
  )
}
