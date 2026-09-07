import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import path from "node:path"

import { intro, outro } from "@clack/prompts"
import { z } from "zod"

import { highlighter, logger } from "../tools/logger.js"

/*
 * Every client stores MCP servers in its own file under its own key, and each
 * of those files usually already has servers in it. Writing the whole file
 * would take someone else's configuration with it, so each writer merges into
 * what is there and leaves the rest untouched.
 */

export const MCP_CLIENTS = [
  "claude",
  "cursor",
  "vscode",
  "codex",
  "opencode",
] as const

export type McpClient = (typeof MCP_CLIENTS)[number]

export function isMcpClient(value: string): value is McpClient {
  return MCP_CLIENTS.some((client) => client === value)
}

const COMMAND = "npx"
const ARGS = ["newtui@latest", "mcp"]

interface ClientTarget {
  /** Where the file lives, relative to the project or absolute. */
  readonly file: (cwd: string) => string
  readonly describe: string
  /** Merge the server into the file's existing contents. */
  readonly merge: (existing: string | null) => string
}

/*
 * The file on disk is someone else's document. It is parsed rather than cast,
 * with unknown keys preserved, so merging into it cannot silently discard a
 * server or a setting this CLI does not know about.
 */
const serverMapSchema = z.record(z.string(), z.unknown())

const jsonConfigSchema = z
  .object({
    mcpServers: serverMapSchema.optional(),
    servers: serverMapSchema.optional(),
    mcp: serverMapSchema.optional(),
  })
  .passthrough()

type JsonConfig = z.infer<typeof jsonConfigSchema>

/** Which key a client keeps its servers under. */
type ServerKey = "mcpServers" | "servers" | "mcp"

function readJsonConfig(existing: string | null): JsonConfig {
  if (existing === null || existing.trim() === "") return {}
  const parsed = jsonConfigSchema.safeParse(JSON.parse(existing))
  if (!parsed.success) {
    throw new Error(
      "The existing configuration is not an object this CLI can merge into. Fix or remove it, then run this again."
    )
  }
  return parsed.data
}

/** One server entry, as each client's file spells it. */
interface ServerEntry {
  readonly command?: string
  readonly args?: readonly string[]
  readonly type?: string
  readonly enabled?: boolean
}

function writeServer(
  existing: string | null,
  key: ServerKey,
  entry: ServerEntry
): string {
  let config: JsonConfig
  try {
    config = readJsonConfig(existing)
  } catch (cause) {
    if (cause instanceof SyntaxError) {
      throw new Error(
        "The existing configuration is not valid JSON. Fix or remove it, then run this again.",
        { cause }
      )
    }
    throw cause
  }

  config[key] = { ...config[key], newtui: entry }
  return `${JSON.stringify(config, null, 2)}\n`
}

/** OpenCode's `mcp` entry, whose command is a single array. */
function writeServerCommandArray(
  existing: string | null,
  command: readonly string[]
): string {
  let config: JsonConfig
  try {
    config = readJsonConfig(existing)
  } catch (cause) {
    if (cause instanceof SyntaxError) {
      throw new Error(
        "The existing configuration is not valid JSON. Fix or remove it, then run this again.",
        { cause }
      )
    }
    throw cause
  }
  config.mcp = {
    ...config.mcp,
    newtui: { type: "local", command, enabled: true },
  }
  return `${JSON.stringify(config, null, 2)}\n`
}

const TARGETS = {
  claude: {
    file: (cwd) => path.join(cwd, ".mcp.json"),
    describe: "Claude Code reads .mcp.json from the project root.",
    merge: (existing) =>
      writeServer(existing, "mcpServers", { command: COMMAND, args: ARGS }),
  },
  cursor: {
    file: (cwd) => path.join(cwd, ".cursor", "mcp.json"),
    describe: "Cursor reads .cursor/mcp.json.",
    merge: (existing) =>
      writeServer(existing, "mcpServers", { command: COMMAND, args: ARGS }),
  },
  vscode: {
    file: (cwd) => path.join(cwd, ".vscode", "mcp.json"),
    describe: "VS Code reads .vscode/mcp.json, under `servers`.",
    merge: (existing) =>
      writeServer(existing, "servers", {
        type: "stdio",
        command: COMMAND,
        args: ARGS,
      }),
  },
  opencode: {
    file: (cwd) => path.join(cwd, "opencode.json"),
    describe: "OpenCode reads opencode.json from the project root.",
    merge: (existing) =>
      // OpenCode spells the launch line as one array rather than a command
      // and its arguments.
      writeServerCommandArray(existing, [COMMAND, ...ARGS]),
  },
  codex: {
    // Codex has one global config rather than a per-project file, and it is
    // TOML, so the block is appended rather than merged into a parsed tree.
    file: () => path.join(homedir(), ".codex", "config.toml"),
    describe: "Codex reads ~/.codex/config.toml.",
    merge: (existing) => {
      const block = [
        "[mcp_servers.newtui]",
        `command = "${COMMAND}"`,
        `args = [${ARGS.map((arg) => `"${arg}"`).join(", ")}]`,
        "",
      ].join("\n")
      if (existing === null) return block
      if (existing.includes("[mcp_servers.newtui]")) return existing
      return `${existing.trimEnd()}\n\n${block}`
    },
  },
} satisfies Record<McpClient, ClientTarget>

export interface McpInitOptions {
  client: string
  cwd: string
}

export async function mcpInit(options: McpInitOptions): Promise<void> {
  if (!isMcpClient(options.client)) {
    logger.error(
      `Unknown client "${options.client}". Pick one of: ${MCP_CLIENTS.join(", ")}.`
    )
    process.exitCode = 1
    return
  }

  const target = TARGETS[options.client]
  const file = target.file(options.cwd)
  const existing = existsSync(file) ? await readFile(file, "utf8") : null

  intro(highlighter.bold(`Configuring ${options.client}`))
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, target.merge(existing), "utf8")

  logger.info(`${existing === null ? "wrote" : "updated"} ${file}`)
  logger.info(target.describe)
  outro(
    `Restart ${options.client}, then ask it to list newt/ui components. The server runs ${highlighter.info(`${COMMAND} ${ARGS.join(" ")}`)}.`
  )
}
