import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

import { readProjectInfo, type ProjectInfo } from "../commands/info.js"
import {
  getRegistryIndex,
  getRegistryItem,
  getRegistryUrl,
} from "../registry/api.js"
import type { RegistryIndex, RegistryItem } from "../schema/index.js"
import {
  DEFAULT_FRAMEWORK,
  frameworkSchema,
  getRawConfig,
  type Framework,
} from "../utils/get-config.js"

/*
 * An MCP server over the same registry the CLI installs from. The tool names
 * deliberately match shadcn's, so an agent that already knows how to shop in
 * one registry needs no new vocabulary for this one; `get_design_tokens` is
 * the addition, because a Discord-inspired system is a token system first.
 *
 * Everything here is read-only. Installing is `get_add_command_for_items`
 * followed by the human — or the agent's shell — running it, which keeps the
 * write out of a tool call nobody reviewed.
 */

const DEFAULT_STYLE = "default"

interface Resolved {
  readonly framework: Framework
  readonly registryUrl: string
  readonly style: string
}

/**
 * The registry to answer from: the one the project's `components.json` names,
 * unless the caller asked for the other framework explicitly.
 */
async function resolve(cwd: string, framework?: Framework): Promise<Resolved> {
  const config = await getRawConfig(cwd).catch(() => null)
  const chosen = framework ?? config?.framework ?? DEFAULT_FRAMEWORK
  return {
    framework: chosen,
    registryUrl: getRegistryUrl(chosen, config?.registry),
    style: config?.style ?? DEFAULT_STYLE,
  }
}

/*
 * The two answer shapes. Their return type is inferred rather than declared:
 * the SDK's own result type is wider than what these produce, and restating a
 * narrower one here makes every handler fail to assign.
 */

/** A tool answering in prose — an explanation, or a checklist. */
function text(message: string) {
  return { content: [{ type: "text" as const, text: message }] }
}

/*
 * Data answers go through `text` as pretty-printed JSON: agents parse the
 * body, and a single content type keeps every handler's shape identical. The
 * payloads are this file's own literals and registry items already parsed by
 * their schema, so the serialiser is named rather than generic.
 */
type ToolPayload =
  | ProjectInfo
  | RegistryItem
  | RegistryItem[]
  | RegistrySummary[]
  | { registry: string; count: number; items: RegistrySummary[] }
  | { registry: string; query: string; count: number; items: RegistrySummary[] }
  | { theme: string; tokens: { name: string; value: string }[] }

function asJson(value: ToolPayload): string {
  return JSON.stringify(value, null, 2)
}

/** The index entry, trimmed to what an agent choosing a component needs. */
interface RegistrySummary {
  name: string
  type: string
  title?: string
  description?: string
  registryDependencies: string[]
  dependencies: string[]
}

function summarise(item: RegistryIndex[number]): RegistrySummary {
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    registryDependencies: item.registryDependencies ?? [],
    dependencies: item.dependencies ?? [],
  }
}

function matches(item: RegistryIndex[number], query: string): boolean {
  const haystack =
    `${item.name} ${item.title ?? ""} ${item.description ?? ""}`.toLowerCase()
  return haystack.includes(query.toLowerCase())
}

const AUDIT_CHECKLIST = `newt/ui review checklist

1. Tokens, not literals. Every colour, radius, shadow, font and duration is a
   --newt-* custom property. A hex, rgb() or oklch() literal where a token
   exists is a defect.
2. No motion. The library ships no transitions, animations or keyframes; state
   is carried by colour, border and shape. Anything added must sit behind
   prefers-reduced-motion.
3. Components are wrapped, not edited. Restyling by editing an installed file
   costs the next \`newtui diff\`. Pass a class, or override a token.
4. .newt-root is on the element wrapping the application, so the font stack and
   base colour are set once.
5. Every icon-only control has an aria-label. Every interactive element is
   reachable with Tab and keeps its :focus-visible ring.
6. Presence and status are never colour alone: a role, an aria-label or text
   states them too.
7. Composition over invention. If something is missing, compose the parts that
   exist rather than writing a new component in the library's style.
8. No Discord logo, wordmark or asset, and copy says "Discord-inspired".`

export function createServer(cwd: string): McpServer {
  const server = new McpServer({ name: "newtui", version: "2.0.0" })

  server.registerTool(
    "get_project_registries",
    {
      title: "Get the project's registries",
      description:
        "Read this project's components.json: which framework it targets, which registry it installs from, where its aliases point, and which newt/ui components it already has.",
      inputSchema: {},
    },
    async () => {
      const project = await readProjectInfo(cwd)
      if (project === null) {
        return text(
          "This directory has no components.json. Run `newtui init` before installing components."
        )
      }
      return text(asJson(project))
    }
  )

  server.registerTool(
    "list_items_in_registries",
    {
      title: "List registry items",
      description:
        "Every item in the registry, with its title and description. Use this before naming a component: if it is not here, it does not exist.",
      inputSchema: {
        framework: frameworkSchema
          .optional()
          .describe("Override the project's framework."),
        type: z
          .string()
          .optional()
          .describe('Registry item type, e.g. "registry:ui". Defaults to all.'),
      },
    },
    async ({ framework, type }) => {
      const { registryUrl } = await resolve(cwd, framework)
      const index = await getRegistryIndex(registryUrl)
      const items = index
        .filter((item) => type === undefined || item.type === type)
        .map(summarise)
      return text(asJson({ registry: registryUrl, count: items.length, items }))
    }
  )

  server.registerTool(
    "search_items_in_registries",
    {
      title: "Search registry items",
      description:
        "Find items whose name, title or description contains the query. Prefer this over guessing a component name.",
      inputSchema: {
        query: z
          .string()
          .describe("What to look for, e.g. 'presence' or 'chat'."),
        framework: frameworkSchema.optional(),
      },
    },
    async ({ query, framework }) => {
      const { registryUrl } = await resolve(cwd, framework)
      const index = await getRegistryIndex(registryUrl)
      const items = index.filter((item) => matches(item, query)).map(summarise)
      return text(
        asJson({ registry: registryUrl, query, count: items.length, items })
      )
    }
  )

  server.registerTool(
    "view_items_in_registries",
    {
      title: "View registry items",
      description:
        "The full source of one or more items, without installing anything. Read this rather than recalling an API.",
      inputSchema: {
        names: z.array(z.string()).describe("Item names, e.g. ['button']."),
        framework: frameworkSchema.optional(),
      },
    },
    async ({ names, framework }) => {
      const { registryUrl, style } = await resolve(cwd, framework)
      const items: RegistryItem[] = []
      for (const name of names) {
        items.push(await getRegistryItem(registryUrl, style, name))
      }
      return text(asJson(items))
    }
  )

  server.registerTool(
    "get_item_examples_from_registries",
    {
      title: "Get a component's examples",
      description:
        "The demo files for a component — the shortest correct usage of it, and what the documentation renders.",
      inputSchema: {
        name: z.string().describe("The component, e.g. 'select-menu'."),
        framework: frameworkSchema.optional(),
      },
    },
    async ({ name, framework }) => {
      const { registryUrl, style } = await resolve(cwd, framework)
      const index = await getRegistryIndex(registryUrl)
      const examples = index.filter(
        (item) =>
          item.type === "registry:example" &&
          (item.name === `${name}-demo` || item.name.startsWith(`${name}-`))
      )
      if (examples.length === 0) {
        return text(`No examples in the registry for "${name}".`)
      }
      const items: RegistryItem[] = []
      for (const example of examples) {
        items.push(await getRegistryItem(registryUrl, style, example.name))
      }
      return text(asJson(items))
    }
  )

  server.registerTool(
    "get_add_command_for_items",
    {
      title: "Get the install command",
      description:
        "The exact command that installs these items into this project, using the package manager it already uses.",
      inputSchema: {
        names: z.array(z.string()).describe("Item names to install."),
      },
    },
    async ({ names }) => {
      const { detect } = await import("package-manager-detector/detect")
      const detected = await detect({ cwd })
      const runner =
        detected?.name === "pnpm"
          ? "pnpm dlx"
          : detected?.name === "yarn"
            ? "yarn dlx"
            : detected?.name === "bun"
              ? "bunx"
              : "npx"
      return text(`${runner} newtui@latest add ${names.join(" ")}`)
    }
  )

  server.registerTool(
    "get_audit_checklist",
    {
      title: "Get the review checklist",
      description:
        "The rules a change built with newt/ui is reviewed against. Run through it before reporting work as finished.",
      inputSchema: {},
    },
    // eslint-disable-next-line @typescript-eslint/require-await -- the SDK's
    // handler signature is async; the checklist is a constant.
    async () => text(AUDIT_CHECKLIST)
  )

  server.registerTool(
    "get_design_tokens",
    {
      title: "Get the design tokens",
      description:
        "Every --newt-* token and its value. These are the only colours, radii, shadows and durations a newt/ui interface may use.",
      inputSchema: {
        theme: z
          .enum(["dark", "light"])
          .optional()
          .describe("Which palette. Defaults to dark, the library's default."),
      },
    },
    async ({ theme }) => {
      const { registryUrl, style } = await resolve(cwd)
      const item = await getRegistryItem(registryUrl, style, "theme-newt")
      const vars = item.cssVars ?? {}
      const values =
        theme === "light" ? { ...vars.dark, ...vars.light } : vars.dark
      return text(
        asJson({
          theme: theme ?? "dark",
          tokens: Object.entries(values ?? {}).map(([name, value]) => ({
            name: `--${name}`,
            value,
          })),
        })
      )
    }
  )

  server.registerPrompt(
    "install-component",
    {
      title: "Install a newt/ui component",
      description:
        "Check the registry for a component, read its source, and install it correctly.",
      argsSchema: { name: z.string() },
    },
    ({ name }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Install the newt/ui component "${name}" in this project. First call search_items_in_registries to confirm the name exists, then view_items_in_registries to read what it imports, then get_add_command_for_items and run that command. Do not write the component's source by hand.`,
          },
        },
      ],
    })
  )

  server.registerPrompt(
    "build-with-newt",
    {
      title: "Build an interface with newt/ui",
      description:
        "Compose an interface from the components in the registry, staying inside the token system.",
      argsSchema: { description: z.string() },
    },
    ({ description }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Build this with newt/ui: ${description}\n\nStart by calling get_project_registries and list_items_in_registries. Compose only components that exist; if one is missing, say which and stop. Take every colour, radius, shadow and duration from get_design_tokens — never a literal. Finish by checking your work against get_audit_checklist.`,
          },
        },
      ],
    })
  )

  return server
}

/** Serve over stdio, which is how every MCP client launches a local server. */
export async function startServer(cwd: string): Promise<void> {
  const server = createServer(cwd)
  await server.connect(new StdioServerTransport())
}
