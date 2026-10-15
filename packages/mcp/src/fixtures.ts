import type { Fetcher } from "./docs.js"

/*
 * A trimmed copy of what Blume writes, including the parts the parser has to
 * skip: the feed, the skill, the agent resources and an off-site link.
 */
export const LLMS_TXT = `# newt/ui

> Discord-inspired components for React and Vue

Copy-paste components for React, Vue and plain HTML/CSS.

## Get Started

- [Introduction](https://newtui.dev/docs): A component library and a design token system.
- [Installation: Nuxt](https://newtui.dev/docs/installation/nuxt): Install newt/ui in a Nuxt 4 project.
- [Theming](https://newtui.dev/docs/theming): One layer of --newt-* custom properties drives every component.
- [Dark mode](https://newtui.dev/docs/dark-mode): newt/ui is dark by default.

## Actions

- [Button](https://newtui.dev/docs/components/button): Displays a Discord-styled button.
- [Toggle button](https://newtui.dev/docs/components/toggle-button): A button that stays pressed.
- [Button](https://newtui.dev/docs/components/button): Listed twice, kept once.

## Other

- [August 2026 — Trusted publishing](https://newtui.dev/changelog/2026-08-npm-oidc): Releases publish over OIDC.
- [Elsewhere](https://example.com/docs/elsewhere): Not this site.

## RSS Feeds

- [newt/ui — Changelog](https://newtui.dev/changelog/rss.xml)

## Agent resources

- [llms-full.txt](https://newtui.dev/llms-full.txt): The full Markdown of every page in one file.
- [API catalog](https://newtui.dev/.well-known/api-catalog): RFC 9727 linkset.
`

export const LLMS_FULL = `# newt/ui

> Discord-inspired components for React and Vue

# Theming
Source: https://newtui.dev/docs/theming

Override a variable such as \`--newt-brand\` rather than a component.

# Not a page
This heading has no Source line under it.

# Button
Source: https://newtui.dev/docs/components/button

Six intents and four sizes.
`

interface FakeSiteOptions {
  /** Answer the first request with a 503, then behave. */
  failFirst?: boolean
}

/** A static site served from memory; records every URL it was asked for. */
export function fakeSite(
  routes: Record<string, string>,
  options: FakeSiteOptions = {}
) {
  const requests: string[] = []
  const pages = new Map(Object.entries(routes))
  const fetcher: Fetcher = (url) => {
    requests.push(url)
    if (options.failFirst === true && requests.length === 1) {
      return Promise.resolve(new Response("unavailable", { status: 503 }))
    }
    const body = pages.get(new URL(url).pathname)
    return Promise.resolve(
      body === undefined
        ? new Response("not found", { status: 404 })
        : new Response(body, { status: 200 })
    )
  }
  return { fetcher, requests }
}
