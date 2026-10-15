import { describe, expect, it } from "vitest"

import {
  DEFAULT_DOCS_URL,
  DocsClient,
  DocsRequestError,
  markdownPathFor,
  parseLlmsFull,
  parseLlmsTxt,
  rankEntries,
  resolveDocsUrl,
  toRoute,
} from "./docs.js"
import { fakeSite, LLMS_FULL, LLMS_TXT } from "./fixtures.js"

const BASE = "http://localhost:4321"

describe("parseLlmsTxt", () => {
  const entries = parseLlmsTxt(LLMS_TXT, BASE)

  it("lists pages with their section, rebased on the configured site", () => {
    expect(entries[0]).toEqual({
      title: "Introduction",
      path: "/docs",
      url: `${BASE}/docs`,
      markdownUrl: `${BASE}/docs.md`,
      description: "A component library and a design token system.",
      section: "Get Started",
    })
    expect(
      entries.find((entry) => entry.path === "/docs/components/button")
    ).toMatchObject({ section: "Actions", title: "Button" })
  })

  it("skips feeds, skills, agent files and other sites", () => {
    const paths = entries.map((entry) => entry.path)
    expect(paths).toEqual([
      "/docs",
      "/docs/installation/nuxt",
      "/docs/theming",
      "/docs/dark-mode",
      "/docs/components/button",
      "/docs/components/toggle-button",
      "/changelog/2026-08-npm-oidc",
    ])
  })
})

describe("parseLlmsFull", () => {
  it("splits on the Source line under a top-level heading", () => {
    const bodies = parseLlmsFull(LLMS_FULL, BASE)
    expect([...bodies.keys()]).toEqual([
      "/docs/theming",
      "/docs/components/button",
    ])
    expect(bodies.get("/docs/theming")).toContain("--newt-brand")
    // A `# ` line inside a body is not a page boundary.
    expect(bodies.get("/docs/theming")).toContain("# Not a page")
  })
})

describe("toRoute", () => {
  it.each([
    ["button", "/button"],
    ["/docs/theming/", "/docs/theming"],
    ["docs/components/button.md", "/docs/components/button"],
    ["https://newtui.dev/docs/dark-mode#toggle", "/docs/dark-mode"],
    ["", "/"],
  ])("reads %j as %j", (input, route) => {
    expect(toRoute(input)).toBe(route)
  })

  it("maps the docs root and the home page to Blume's twins", () => {
    expect(markdownPathFor("/docs")).toBe("/docs.md")
    expect(markdownPathFor("/")).toBe("/index.md")
  })
})

describe("resolveDocsUrl", () => {
  it("prefers the flag, then the environment, then the default", () => {
    expect(resolveDocsUrl("http://a", "http://b")).toBe("http://a")
    expect(resolveDocsUrl(undefined, "http://b")).toBe("http://b")
    expect(resolveDocsUrl(" ", undefined)).toBe(DEFAULT_DOCS_URL)
  })
})

describe("rankEntries", () => {
  const entries = parseLlmsTxt(LLMS_TXT, BASE)

  it("puts an exact title match first and needs every term", () => {
    const hits = rankEntries(entries, "button")
    expect(hits.map((hit) => hit.path)).toEqual([
      "/docs/components/button",
      "/docs/components/toggle-button",
    ])
    expect(rankEntries(entries, "button nuxt")).toEqual([])
  })

  it("finds a term mentioned only in a body, with an excerpt", () => {
    const bodies = parseLlmsFull(LLMS_FULL, BASE)
    expect(rankEntries(entries, "brand")).toEqual([])
    const [hit] = rankEntries(entries, "brand", bodies)
    expect(hit?.path).toBe("/docs/theming")
    expect(hit?.excerpt).toContain("--newt-brand")
  })
})

describe("DocsClient", () => {
  it("reads the index from llms.txt", async () => {
    const site = fakeSite({ "/llms.txt": LLMS_TXT })
    const docs = new DocsClient({ baseUrl: `${BASE}/`, fetcher: site.fetcher })
    const pages = await docs.listDocs()
    expect(docs.baseUrl).toBe(BASE)
    expect(pages).toHaveLength(7)
    expect(site.requests).toEqual([`${BASE}/llms.txt`])
  })

  it("falls back to the JSON docs API when llms.txt is not served", async () => {
    const site = fakeSite({
      "/api/docs/pages.json": JSON.stringify({
        pages: [
          { route: "/404", title: "Page not found" },
          {
            route: "/docs/theming",
            title: "Theming",
            description: "Override a variable.",
            contentType: "docs",
          },
        ],
      }),
    })
    const docs = new DocsClient({ baseUrl: BASE, fetcher: site.fetcher })
    expect(await docs.listDocs()).toEqual([
      {
        title: "Theming",
        path: "/docs/theming",
        url: `${BASE}/docs/theming`,
        markdownUrl: `${BASE}/docs/theming.md`,
        description: "Override a variable.",
        section: "docs",
      },
    ])
  })

  it("throws when the site publishes no index at all", async () => {
    const docs = new DocsClient({
      baseUrl: BASE,
      fetcher: fakeSite({}).fetcher,
    })
    await expect(docs.listDocs()).rejects.toBeInstanceOf(DocsRequestError)
  })

  it("caches responses until the ttl runs out", async () => {
    let clock = 0
    const site = fakeSite({ "/llms.txt": LLMS_TXT })
    const docs = new DocsClient({
      baseUrl: BASE,
      fetcher: site.fetcher,
      ttl: 1000,
      now: () => clock,
    })
    await docs.listDocs()
    await docs.listDocs()
    expect(site.requests).toHaveLength(1)
    clock = 1001
    await docs.listDocs()
    expect(site.requests).toHaveLength(2)
  })

  it("does not cache a server error", async () => {
    const site = fakeSite({ "/llms.txt": LLMS_TXT }, { failFirst: true })
    const docs = new DocsClient({ baseUrl: BASE, fetcher: site.fetcher })
    await expect(docs.listDocs()).rejects.toThrow("503")
    expect(await docs.listDocs()).toHaveLength(7)
  })

  it("searches bodies only when asked, and says whether it could", async () => {
    const docs = new DocsClient({
      baseUrl: BASE,
      fetcher: fakeSite({ "/llms.txt": LLMS_TXT, "/llms-full.txt": LLMS_FULL })
        .fetcher,
    })
    expect(await docs.searchDocs("brand", false)).toEqual({
      searchedContent: false,
      hits: [],
    })
    const withContent = await docs.searchDocs("brand", true)
    expect(withContent.searchedContent).toBe(true)
    expect(withContent.hits[0]?.path).toBe("/docs/theming")
  })

  it("resolves a bare slug through the index in one request", async () => {
    const site = fakeSite({
      "/llms.txt": LLMS_TXT,
      "/docs/components/button.md": "# Button\n\nSix intents.",
    })
    const docs = new DocsClient({ baseUrl: BASE, fetcher: site.fetcher })
    const page = await docs.getDoc("button")
    expect(page).toMatchObject({
      found: true,
      entry: { title: "Button", path: "/docs/components/button" },
      markdown: "# Button\n\nSix intents.",
    })
    expect(site.requests).toEqual([
      `${BASE}/llms.txt`,
      `${BASE}/docs/components/button.md`,
    ])
  })

  it("tries a route under /docs when the index does not list it", async () => {
    const site = fakeSite({ "/docs/registry.md": "# Registry" })
    const docs = new DocsClient({ baseUrl: BASE, fetcher: site.fetcher })
    expect(await docs.getDoc("registry")).toMatchObject({
      found: true,
      entry: { path: "/docs/registry" },
    })
  })

  it("suggests close pages when nothing matches", async () => {
    const docs = new DocsClient({
      baseUrl: BASE,
      fetcher: fakeSite({ "/llms.txt": LLMS_TXT }).fetcher,
    })
    const page = await docs.getDoc("dark")
    expect(page.found).toBe(false)
    expect(page).toMatchObject({
      path: "/dark",
      suggestions: [{ path: "/docs/dark-mode" }],
    })
  })
})
