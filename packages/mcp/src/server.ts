import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

import packageJson from "../package.json" with { type: "json" }
import type { DocEntry, DocsClient, SearchHit } from "./docs.js"

/*
 * An MCP server over the newt/ui documentation. The `newtui mcp` server in the
 * CLI answers "which components exist and what is their source"; this one
 * answers "what do the docs say" — installation per framework, theming, the
 * token reference, accessibility notes, the registry format. Every tool is
 * read-only and reads only what the site publishes for agents.
 */

const DEFAULT_LIMIT = 10
const MAX_LIMIT = 50

/** A tool answering in prose or Markdown. */
function text(message: string) {
  return { content: [{ type: "text" as const, text: message }] }
}

/** A tool reporting a failure the agent should read rather than retry blindly. */
function failure(message: string) {
  return { ...text(message), isError: true }
}

/*
 * Data answers are pretty-printed JSON in one text block, like the CLI's
 * server: agents parse the body, and one content type keeps every handler's
 * shape identical. The payloads are this file's own literals.
 */
type ToolPayload =
  | { site: string; count: number; pages: DocEntry[] }
  | {
      site: string
      query: string
      searchedContent: boolean
      count: number
      results: SearchHit[]
    }
  | { site: string; path: string; suggestions: DocEntry[] }

function asJson(value: ToolPayload): string {
  return JSON.stringify(value, null, 2)
}

export function createServer(docs: DocsClient): McpServer {
  const server = new McpServer({
    name: "newtui-docs",
    version: packageJson.version,
  })

  server.registerTool(
    "list_docs",
    {
      title: "List documentation pages",
      description:
        "Every page of the newt/ui documentation (Discord-inspired components for React, Vue and HTML/CSS) with its title, route, description and section. Use it to find the page to read with get_doc.",
      inputSchema: {
        section: z
          .string()
          .optional()
          .describe(
            "Only pages listed under this section, e.g. 'Installation' or 'Forms'. Case-insensitive."
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ section }) => {
      const all = await docs.listDocs()
      const pages =
        section === undefined
          ? all
          : all.filter(
              (page) => page.section?.toLowerCase() === section.toLowerCase()
            )
      return text(asJson({ site: docs.baseUrl, count: pages.length, pages }))
    }
  )

  server.registerTool(
    "search_docs",
    {
      title: "Search the documentation",
      description:
        "Keyword search over the newt/ui docs. Ranks pages by where every query term appears: title first, then route, description and section. Set content to true to search page bodies as well — slower, but it finds a prop or a token mentioned only inside a page.",
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe("Keywords, e.g. 'dark mode' or 'nuxt install'."),
        content: z
          .boolean()
          .optional()
          .describe("Also search the full text of every page."),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_LIMIT)
          .optional()
          .describe(
            `How many results to return. Defaults to ${DEFAULT_LIMIT}.`
          ),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ query, content, limit }) => {
      const result = await docs.searchDocs(query, content ?? false)
      const results = result.hits.slice(0, limit ?? DEFAULT_LIMIT)
      return text(
        asJson({
          site: docs.baseUrl,
          query,
          searchedContent: result.searchedContent,
          count: results.length,
          results,
        })
      )
    }
  )

  server.registerTool(
    "get_doc",
    {
      title: "Read a documentation page",
      description:
        "One page of the newt/ui docs as Markdown. Accepts a route ('/docs/theming'), a slug ('button', 'installation/nuxt') or a full newtui.dev URL. Read this rather than recalling an API from memory.",
      inputSchema: {
        path: z.string().min(1).describe("The page: a route, a slug or a URL."),
      },
      annotations: { readOnlyHint: true, openWorldHint: true },
    },
    async ({ path }) => {
      const page = await docs.getDoc(path)
      if (!page.found) {
        return failure(
          `No documentation page at "${page.path}". Closest matches:\n\n${asJson(
            {
              site: docs.baseUrl,
              path: page.path,
              suggestions: page.suggestions,
            }
          )}`
        )
      }
      return text(`<!-- Source: ${page.entry.url} -->\n\n${page.markdown}`)
    }
  )

  return server
}

/** Serve over stdio, which is how every MCP client launches a local server. */
export async function startServer(docs: DocsClient): Promise<void> {
  await createServer(docs).connect(new StdioServerTransport())
}
