import { existsSync } from "node:fs"
import { mkdtemp, readFile, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"

import { beforeEach, describe, expect, it, vi } from "vitest"
import { z } from "zod"

import { isMcpClient, mcpInit, MCP_CLIENTS } from "../src/mcp/init.js"

/*
 * `mcp init` writes into files an editor already owns. The behaviour worth
 * pinning down is not the shape it writes — that is one object — but that it
 * leaves everything else in the file alone.
 */
async function tempProject(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), "newtui-mcp-"))
}

describe("isMcpClient", () => {
  it("accepts every documented client", () => {
    for (const client of MCP_CLIENTS) expect(isMcpClient(client)).toBe(true)
  })

  it("rejects anything else", () => {
    expect(isMcpClient("emacs")).toBe(false)
  })
})

describe("mcpInit", () => {
  beforeEach(() => {
    // The command prints with @clack/prompts, which is noise in a test run.
    vi.spyOn(console, "log").mockImplementation(() => {})
  })

  it("writes .mcp.json for Claude Code", async () => {
    const cwd = await tempProject()
    await mcpInit({ client: "claude", cwd })

    const written: unknown = JSON.parse(
      await readFile(path.join(cwd, ".mcp.json"), "utf8")
    )
    expect(written).toEqual({
      mcpServers: {
        newtui: { command: "npx", args: ["newtui@latest", "mcp"] },
      },
    })
  })

  it("keeps the servers a project already had", async () => {
    const cwd = await tempProject()
    await writeFile(
      path.join(cwd, ".mcp.json"),
      JSON.stringify({ mcpServers: { other: { command: "node" } } }),
      "utf8"
    )

    await mcpInit({ client: "claude", cwd })

    const written = z
      .object({ mcpServers: z.record(z.string(), z.unknown()) })
      .parse(JSON.parse(await readFile(path.join(cwd, ".mcp.json"), "utf8")))
    expect(Object.keys(written.mcpServers).toSorted()).toEqual([
      "newtui",
      "other",
    ])
  })

  it("uses the `servers` key and a stdio type for VS Code", async () => {
    const cwd = await tempProject()
    await mcpInit({ client: "vscode", cwd })

    const written = z
      .object({ servers: z.object({ newtui: z.object({ type: z.string() }) }) })
      .parse(
        JSON.parse(
          await readFile(path.join(cwd, ".vscode", "mcp.json"), "utf8")
        )
      )
    expect(written.servers.newtui.type).toBe("stdio")
  })

  it("reports an unknown client instead of writing a file", async () => {
    const cwd = await tempProject()

    await mcpInit({ client: "emacs", cwd })

    expect(process.exitCode).toBe(1)
    expect(existsSync(path.join(cwd, ".mcp.json"))).toBe(false)
    process.exitCode = 0
  })
})
