import { z } from "zod"

import type { Framework } from "../utils/get-config.js"
import type { RegistryItem } from "./schema.js"

/*
 * Third-party registries.
 *
 * `newtui add @magicui/marquee` installs from somebody else's registry. The
 * namespace resolves, in order, through the project's own `registries` map in
 * `components.json`, the registries this file knows by name, and the public
 * directory the framework's shadcn port publishes — the React one for a React
 * project, the Vue one for a Vue project. Nothing is written to
 * `components.json` on the way: a namespace that resolved from the directory
 * today resolves from it again tomorrow.
 */

/** `@namespace/item` — the item name may itself contain slashes. */
const NAMESPACED = /^(@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?)\/(.+)$/

export interface NamespacedName {
  readonly namespace: string
  readonly item: string
}

export function parseNamespaced(name: string): NamespacedName | undefined {
  const match = NAMESPACED.exec(name)
  if (match === null) return undefined
  const [, namespace, item] = match
  if (namespace === undefined || item === undefined) return undefined
  return { namespace, item }
}

export function isNamespaced(name: string): boolean {
  return parseNamespaced(name) !== undefined
}

/**
 * One entry of `registries` in `components.json`: a URL template, or the same
 * with the headers and query parameters a private registry asks for.
 */
export const registryEntrySchema = z.union([
  z.string(),
  z.object({
    url: z.string(),
    headers: z.record(z.string(), z.string()).optional(),
    params: z.record(z.string(), z.string()).optional(),
  }),
])
export type RegistryEntry = z.infer<typeof registryEntrySchema>

export const registriesSchema = z.record(
  z.string().regex(/^@/, 'a registry namespace starts with "@"'),
  registryEntrySchema
)
export type Registries = z.infer<typeof registriesSchema>

/** Where each framework's community directory is published. */
const DIRECTORY_URLS = {
  react: "https://ui.shadcn.com/r/registries.json",
  vue: "https://www.shadcn-vue.com/r/registries.json",
} as const satisfies Record<Framework, string>

/**
 * The registries every third-party item leans on. An item from a community
 * registry names its dependencies bare — `button`, `card` — and means the
 * shadcn component of that name, so those resolve here.
 */
const BUILT_IN_REGISTRIES = {
  react: { "@shadcn": "https://ui.shadcn.com/r/styles/{style}/{name}.json" },
  vue: { "@shadcn": "https://www.shadcn-vue.com/r/styles/{style}/{name}.json" },
} as const satisfies Record<Framework, Registries>

/** The namespace a third-party item's bare dependencies belong to. */
export const SHADCN_NAMESPACE = "@shadcn"

/**
 * newt/ui's own namespace. Its payloads name their dependencies `@newtui/chat`
 * so that another CLI, which reads a bare name as a shadcn component, fetches
 * the right item. This CLI reads it as the registry the item came from.
 */
export const NEWTUI_NAMESPACE = "@newtui"

/**
 * `{style}` in a third-party template. newt/ui's own style name means nothing
 * to another registry, so the one both shadcn ports serve today stands in.
 */
const THIRD_PARTY_STYLE = "new-york-v4"

export function getDirectoryUrl(framework: Framework): string {
  return process.env.NEWT_REGISTRY_DIRECTORY_URL ?? DIRECTORY_URLS[framework]
}

/*
 * The two directories are not the same document. shadcn-vue publishes a map
 * of namespace to URL template; shadcn/ui publishes a list of entries that
 * carry a homepage, a description and health data beside the template.
 */
const directorySchema = z.union([
  z.record(z.string(), registryEntrySchema),
  z.array(
    z
      .object({
        name: z.string(),
        url: z.string(),
        homepage: z.string().optional(),
        description: z.string().optional(),
      })
      .passthrough()
  ),
])

export interface DirectoryEntry {
  readonly name: string
  readonly url: string
  readonly homepage?: string
  readonly description?: string
}

const directoryCache = new Map<string, Promise<readonly DirectoryEntry[]>>()

async function fetchDirectory(url: string): Promise<readonly DirectoryEntry[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch the registry directory at ${url} (${response.status} ${response.statusText}).`
    )
  }
  const data: unknown = await response.json()
  const parsed = directorySchema.parse(data)
  if (Array.isArray(parsed)) {
    return parsed.map(({ name, url: template, homepage, description }) => ({
      name,
      url: template,
      homepage,
      description,
    }))
  }
  return Object.entries(parsed).map(([name, entry]) => ({
    name,
    url: entry instanceof Object ? entry.url : entry,
  }))
}

/** The framework's public directory, fetched once per process. */
export function getDirectory(
  framework: Framework
): Promise<readonly DirectoryEntry[]> {
  const url = getDirectoryUrl(framework)
  let pending = directoryCache.get(url)
  if (pending === undefined) {
    pending = fetchDirectory(url)
    /* A failed fetch is not worth remembering: the next command may be online. */
    pending.catch(() => directoryCache.delete(url))
    directoryCache.set(url, pending)
  }
  return pending
}

/** `${NAME}` from the environment — tokens stay out of `components.json`. */
function expandEnv(value: string, namespace: string, trusted: boolean): string {
  /*
   * Only what the reader wrote in `components.json` may read their
   * environment. A template from a public directory is somebody else's text:
   * `?k=${GITHUB_TOKEN}` there would send the variable to that host.
   */
  if (!trusted) return value
  return value.replaceAll(/\$\{(\w+)\}/g, (_, name: string) => {
    const resolved = process.env[name]
    if (resolved === undefined) {
      throw new Error(
        `Registry "${namespace}" needs the environment variable ${name}, which is not set.`
      )
    }
    return resolved
  })
}

/** An entry and whether the reader wrote it into their own `components.json`. */
export interface ResolvedEntry {
  readonly entry: RegistryEntry
  readonly trusted: boolean
}

export interface RegistryRequest {
  readonly url: string
  readonly headers: Readonly<Record<string, string>>
}

/** Fill a registry's URL template in for one item. */
export function buildRegistryRequest(
  namespace: string,
  { entry, trusted }: ResolvedEntry,
  item: string
): RegistryRequest {
  const template = entry instanceof Object ? entry.url : entry
  if (!template.includes("{name}")) {
    throw new Error(
      `Registry "${namespace}" has no {name} placeholder in its url: ${template}`
    )
  }
  const url = new URL(
    expandEnv(template, namespace, trusted)
      .replaceAll("{name}", item)
      .replaceAll("{style}", THIRD_PARTY_STYLE)
  )
  const headers: Record<string, string> = {}
  if (entry instanceof Object) {
    for (const [key, value] of Object.entries(entry.params ?? {})) {
      url.searchParams.set(key, expandEnv(value, namespace, trusted))
    }
    for (const [key, value] of Object.entries(entry.headers ?? {})) {
      headers[key] = expandEnv(value, namespace, trusted)
    }
  }
  return { url: url.toString(), headers }
}

/** Find a namespace's entry: the project's own first, the directory last. */
export async function resolveRegistryEntry(
  namespace: string,
  framework: Framework,
  registries: Registries | undefined
): Promise<ResolvedEntry> {
  const configured = registries?.[namespace]
  if (configured !== undefined) return { entry: configured, trusted: true }

  const builtIn: Registries = BUILT_IN_REGISTRIES[framework]
  const known = builtIn[namespace]
  if (known !== undefined) return { entry: known, trusted: false }

  const directory = await getDirectory(framework)
  const listed = directory.find((entry) => entry.name === namespace)
  if (listed !== undefined) return { entry: listed.url, trusted: false }

  throw new Error(
    `Unknown registry "${namespace}". It is not in the ${framework} directory (${getDirectoryUrl(framework)}); add it to components.json:\n` +
      JSON.stringify(
        { registries: { [namespace]: "https://example.com/r/{name}.json" } },
        null,
        2
      )
  )
}

/*
 * What a third-party component assumes is already in the project: shadcn's
 * semantic colours. Each is pointed at the newt/ui token that plays the same
 * part, so a component from another registry arrives wearing the project's
 * theme instead of rendering unstyled. `@theme inline` keeps the utilities
 * reading the token where they are used, which is what lets a `.newt-light`
 * wrapper or a preset override reach them.
 */
const SHADCN_BRIDGE_THEME = {
  "--color-background": "var(--newt-bg-base)",
  "--color-foreground": "var(--newt-text-primary)",
  "--color-card": "var(--newt-bg-surface)",
  "--color-card-foreground": "var(--newt-text-primary)",
  "--color-popover": "var(--newt-bg-floating)",
  "--color-popover-foreground": "var(--newt-text-primary)",
  "--color-primary": "var(--newt-brand)",
  "--color-primary-foreground": "var(--newt-on-accent)",
  "--color-secondary": "var(--newt-bg-elevated)",
  "--color-secondary-foreground": "var(--newt-text-primary)",
  "--color-muted": "var(--newt-bg-surface)",
  "--color-muted-foreground": "var(--newt-text-muted)",
  "--color-accent": "var(--newt-bg-hover)",
  "--color-accent-foreground": "var(--newt-text-primary)",
  "--color-destructive": "var(--newt-danger)",
  "--color-border": "var(--newt-border)",
  "--color-input": "var(--newt-border)",
  "--color-ring": "var(--newt-brand)",
  "--color-chart-1": "var(--newt-brand)",
  "--color-chart-2": "var(--newt-online)",
  "--color-chart-3": "var(--newt-idle)",
  "--color-chart-4": "var(--newt-dnd)",
  "--color-chart-5": "var(--newt-mention-role)",
  "--color-sidebar": "var(--newt-bg-surface)",
  "--color-sidebar-foreground": "var(--newt-text-primary)",
  "--color-sidebar-primary": "var(--newt-brand)",
  "--color-sidebar-primary-foreground": "var(--newt-on-accent)",
  "--color-sidebar-accent": "var(--newt-bg-hover)",
  "--color-sidebar-accent-foreground": "var(--newt-text-primary)",
  "--color-sidebar-border": "var(--newt-border)",
  "--color-sidebar-ring": "var(--newt-brand)",
  "--radius-xl": "calc(var(--newt-radius-lg) + 4px)",
} as const

/** Installed once, alongside the first third-party item. Tailwind v4 only. */
export const SHADCN_BRIDGE_ITEM: RegistryItem = {
  name: "shadcn-bridge",
  type: "registry:theme",
  css: { "@theme inline": { ...SHADCN_BRIDGE_THEME } },
}
