import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { describe, expect, it } from "vitest"
import { z } from "zod"

import { DocsClient } from "./docs.js"
import { fakeSite, LLMS_FULL, LLMS_TXT } from "./fixtures.js"
import { createServer } from "./server.js"

const BASE = "http://localhost:4321"

/** Every tool answers with one text block; this is how a test reads it. */
const textResultSchema = z.object({
  content: z.array(z.object({ type: z.literal("text"), text: z.string() })),
  isError: z.boolean().optional(),
})

const listSchema = z.object({
  site: z.string(),
  count: z.number(),
  pages: z.array(z.object({ path: z.string(), section: z.string() })),
})

const searchSchema = z.object({
  searchedContent: z.boolean(),
  count: z.number(),
  results: z.array(z.object({ path: z.string(), score: z.number() })),
})

async function connect() {
  const site = fakeSite({
    "/llms.txt": LLMS_TXT,
    "/llms-full.txt": LLMS_FULL,
    "/docs/theming.md": "# Theming\n\nOverride a variable.",
  })
  const docs = new DocsClient({ baseUrl: BASE, fetcher: site.fetcher })
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair()
  const client = new Client({ name: "test", version: "0.0.0" })
  await Promise.all([
    client.connect(clientTransport),
    createServer(docs).connect(serverTransport),
  ])
  return client
}

async function call(name: string, args: Record<string, string | boolean>) {
  const client = await connect()
  const result = textResultSchema.parse(
    await client.callTool({ name, arguments: args })
  )
  return { text: result.content[0]?.text ?? "", isError: result.isError }
}

describe("the docs MCP server", () => {
  it("exposes the documented, read-only tools", async () => {
    const client = await connect()
    const { tools } = await client.listTools()

    expect(tools.map((tool) => tool.name).toSorted()).toEqual([
      "get_doc",
      "list_docs",
      "search_docs",
    ])
    expect(tools.every((tool) => tool.annotations?.readOnlyHint === true)).toBe(
      true
    )
  })

  it("lists pages, optionally by section", async () => {
    const all = listSchema.parse(JSON.parse((await call("list_docs", {})).text))
    expect(all.site).toBe(BASE)
    expect(all.count).toBe(7)

    const actions = listSchema.parse(
      JSON.parse((await call("list_docs", { section: "actions" })).text)
    )
    expect(actions.pages.map((page) => page.path)).toEqual([
      "/docs/components/button",
      "/docs/components/toggle-button",
    ])
  })

  it("searches titles, and bodies when asked", async () => {
    const titles = searchSchema.parse(
      JSON.parse((await call("search_docs", { query: "dark mode" })).text)
    )
    expect(titles.results[0]?.path).toBe("/docs/dark-mode")

    const bodies = searchSchema.parse(
      JSON.parse(
        (await call("search_docs", { query: "newt-brand", content: true })).text
      )
    )
    expect(bodies.searchedContent).toBe(true)
    expect(bodies.results.map((hit) => hit.path)).toEqual(["/docs/theming"])
  })

  it("returns a page's Markdown with its source", async () => {
    const answer = await call("get_doc", { path: "theming" })
    expect(answer.isError).toBeUndefined()
    expect(answer.text).toBe(
      `<!-- Source: ${BASE}/docs/theming -->\n\n# Theming\n\nOverride a variable.`
    )
  })

  it("reports a missing page as an error with suggestions", async () => {
    const answer = await call("get_doc", { path: "/docs/buttonz" })
    expect(answer.isError).toBe(true)
    expect(answer.text).toContain('No documentation page at "/docs/buttonz"')
    expect(answer.text).toContain('"path": "/docs/components/button"')
  })
})
