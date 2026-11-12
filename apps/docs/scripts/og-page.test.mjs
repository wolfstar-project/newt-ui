import { join } from "node:path"

import { describe, expect, it } from "vitest"

import {
  decodeEntities,
  eyebrowOf,
  metaContent,
  routeOf,
  titleOf,
} from "./og-page.mjs"

const cards = join("dist", "og")

describe("routeOf", () => {
  it("maps the home card to the root", () => {
    expect(routeOf(join(cards, "index.png"), cards)).toBe("/")
  })

  it("maps a nested card to its route", () => {
    expect(
      routeOf(join(cards, "docs", "components", "button.png"), cards)
    ).toBe("/docs/components/button")
  })

  it("does not take a nested index for the home page", () => {
    expect(routeOf(join(cards, "docs", "index.png"), cards)).toBe("/docs/index")
  })
})

describe("metaContent", () => {
  const html =
    '<head><meta property="og:title" content="Tom &amp; Jerry &quot;live&quot; - newt/ui"><meta property="og:description" content="A &lt;b&gt; tag"></head>'

  it("reads a value and decodes its entities", () => {
    expect(metaContent(html, "og:title")).toBe('Tom & Jerry "live" - newt/ui')
    expect(metaContent(html, "og:description")).toBe("A <b> tag")
  })

  it("is undefined when the page has no such tag", () => {
    expect(metaContent(html, "og:image")).toBeUndefined()
  })

  it("does not decode an ampersand twice", () => {
    expect(decodeEntities("&amp;lt;")).toBe("&lt;")
  })
})

describe("titleOf", () => {
  it("drops the site suffix", () => {
    expect(titleOf("Button - newt/ui", "newt/ui")).toBe("Button")
  })

  it("keeps a title that has no suffix", () => {
    expect(titleOf("Button", "newt/ui")).toBe("Button")
  })

  it("falls back to the site name when the page has no og:title", () => {
    expect(titleOf(undefined, "newt/ui")).toBe("newt/ui")
  })
})

describe("eyebrowOf", () => {
  const meta = new Map([
    ["chat-window", { type: "registry:block" }],
    ["button", { type: "registry:ui" }],
  ])

  it.each([
    ["/docs/components/chat-window", "Block"],
    ["/docs/components/button", "Component"],
    ["/docs/components/unknown", "Component"],
    ["/", "React · Vue · HTML & CSS"],
    ["/docs/cli", "Documentation"],
    ["/changelog/v1", "Changelog"],
    ["/blocks", "Blocks"],
    ["/create", "newt/ui"],
  ])("says what %s is", (route, expected) => {
    expect(eyebrowOf(route, meta, "newt/ui")).toBe(expected)
  })
})
