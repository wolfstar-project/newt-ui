import { mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js"
import { describe, expect, it } from "vitest"
import { z } from "zod"

import { createServer } from "./server.js"

/** Every tool answers with one text block; this is how a test reads it. */
const textResultSchema = z.object({
  content: z.array(z.object({ type: z.literal("text"), text: z.string() })),
})

/*
 * The contract an agent depends on is the tool list and their names — those
 * mirror shadcn's on purpose, so renaming one silently would strand every
 * prompt written against them.
 */
async function connect() {
  const cwd = await mkdtemp(path.join(tmpdir(), "newtui-mcp-server-"))
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair()
  const client = new Client({ name: "test", version: "0.0.0" })
  await Promise.all([
    client.connect(clientTransport),
    createServer(cwd).connect(serverTransport),
  ])
  return { client, cwd }
}

describe("the MCP server", () => {
  it("exposes the documented tools", async () => {
    const { client } = await connect()
    const { tools } = await client.listTools()

    expect(tools.map((tool) => tool.name).toSorted()).toEqual([
      "get_add_command_for_items",
      "get_audit_checklist",
      "get_design_tokens",
      "get_item_examples_from_registries",
      "get_project_registries",
      "list_items_in_registries",
      "search_items_in_registries",
      "view_items_in_registries",
    ])
  })

  it("exposes the documented prompts", async () => {
    const { client } = await connect()
    const { prompts } = await client.listPrompts()

    expect(prompts.map((prompt) => prompt.name).toSorted()).toEqual([
      "build-with-newt",
      "install-component",
    ])
  })

  it("says what to do when the directory has no components.json", async () => {
    const { client } = await connect()
    const result = await client.callTool({
      name: "get_project_registries",
      arguments: {},
    })

    const answer = textResultSchema.parse(result).content[0]?.text ?? ""
    expect(answer).toContain("newtui init")
  })

  it("returns the checklist without touching the network", async () => {
    const { client } = await connect()
    const result = await client.callTool({
      name: "get_audit_checklist",
      arguments: {},
    })

    const answer = textResultSchema.parse(result).content[0]?.text ?? ""
    expect(answer).toContain("--newt-*")
    expect(answer).toContain("Discord-inspired")
  })
})
