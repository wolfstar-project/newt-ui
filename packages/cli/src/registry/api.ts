import { z } from "zod"

import type { Framework } from "../utils/get-config.js"
import {
  buildRegistryRequest,
  parseNamespaced,
  resolveRegistryEntry,
  NEWTUI_NAMESPACE,
  SHADCN_NAMESPACE,
  type Registries,
} from "./namespaces.js"
import {
  registryIndexSchema,
  registryItemSchema,
  thirdPartyRegistryItemSchema,
  type RegistryIndex,
  type RegistryItem,
} from "./schema.js"

/**
 * React and Vue components are served from their own registry, each item
 * carrying a `framework` field naming which one it came from. The project's
 * `components.json` picks the base url; `--registry` and `NEWT_REGISTRY_URL`
 * override it for custom registries.
 */
const DEFAULT_REGISTRY_URLS = {
  react: "https://newtui.dev/r",
  vue: "https://newtui.dev/vue/r",
} as const satisfies Record<Framework, string>

export function getRegistryUrl(
  framework: Framework,
  override?: string
): string {
  const url =
    override ??
    process.env.NEWT_REGISTRY_URL ??
    DEFAULT_REGISTRY_URLS[framework]
  return url.replace(/\/+$/, "")
}

/** Fetch `url` as JSON and parse it against `schema`, the I/O boundary for all registry reads. */
async function fetchJson<T>(
  url: string,
  schema: z.ZodType<T, z.ZodTypeDef, unknown>,
  headers?: Readonly<Record<string, string>>
): Promise<T> {
  const response = await fetch(url, headers ? { headers } : undefined)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url} (${response.status} ${response.statusText}).`
    )
  }
  const data: unknown = await response.json()
  return schema.parse(data)
}

export async function getRegistryIndex(
  registryUrl: string
): Promise<RegistryIndex> {
  return fetchJson(`${registryUrl}/index.json`, registryIndexSchema)
}

export async function getRegistryItem(
  registryUrl: string,
  style: string,
  name: string
): Promise<RegistryItem> {
  // Support `name` being a full URL to a registry item (custom registries).
  const url = /^https?:\/\//.test(name)
    ? name
    : `${registryUrl}/styles/${style}/${name}.json`
  try {
    return await fetchJson(url, registryItemSchema)
  } catch (error) {
    // A schema mismatch means the fetch succeeded but the payload was not a
    // valid registry item; keep that distinct from a network/HTTP failure.
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid registry item "${name}": ${error.message}`, {
        cause: error,
      })
    }
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`Component "${name}" not found in registry.\n${detail}`, {
      cause: error,
    })
  }
}

/** Everything needed to turn a name on the command line into a registry item. */
export interface RegistrySource {
  /** The newt/ui registry this project installs from. */
  readonly registryUrl: string
  readonly style: string
  readonly framework: Framework
  /** `registries` from `components.json`, when the project declares any. */
  readonly registries?: Registries
}

/** Fetch `@namespace/item` from the registry that namespace resolves to. */
async function getThirdPartyItem(
  source: RegistrySource,
  namespace: string,
  item: string
): Promise<RegistryItem> {
  const resolved = await resolveRegistryEntry(
    namespace,
    source.framework,
    source.registries
  )
  const request = buildRegistryRequest(namespace, resolved, item)
  try {
    return await fetchJson(
      request.url,
      thirdPartyRegistryItemSchema,
      request.headers
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Invalid registry item "${namespace}/${item}": ${error.message}`,
        { cause: error }
      )
    }
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(
      `"${item}" was not found in the ${namespace} registry.\n${detail}`,
      { cause: error }
    )
  }
}

/**
 * Fetch one item by the name a person typed: a newt/ui component, a full URL,
 * or `@namespace/item` from a third-party registry.
 */
export async function getSourceItem(
  source: RegistrySource,
  name: string
): Promise<RegistryItem> {
  const namespaced = parseNamespaced(name)
  return namespaced === undefined
    ? getRegistryItem(source.registryUrl, source.style, name)
    : getThirdPartyItem(source, namespaced.namespace, namespaced.item)
}

/**
 * Resolve the full dependency tree for the given names (including transitive
 * `registryDependencies`) and return items in install order (deps first).
 *
 * A bare dependency belongs to the registry of the item that named it: inside
 * a newt/ui item it is another newt/ui item, and inside a third-party item it
 * is the shadcn component that registry was written against.
 */
export async function resolveTree(
  source: RegistrySource,
  names: string[]
): Promise<RegistryItem[]> {
  const resolved = new Map<string, RegistryItem>()
  const visiting = new Set<string>()

  async function visit(
    requested: string,
    inThirdParty: boolean
  ): Promise<void> {
    const own = parseNamespaced(requested)
    const isOwn = own?.namespace === NEWTUI_NAMESPACE
    const name = isOwn ? own.item : requested
    const thirdParty = inThirdParty && !isOwn
    const isUrl = /^https?:\/\//.test(name)
    const qualified =
      thirdParty && !isUrl && parseNamespaced(name) === undefined
        ? `${SHADCN_NAMESPACE}/${name}`
        : name
    if (resolved.has(qualified) || visiting.has(qualified)) return
    visiting.add(qualified)
    const item = await getSourceItem(source, qualified)
    const fromThirdParty =
      thirdParty || parseNamespaced(qualified) !== undefined
    for (const dep of item.registryDependencies ?? []) {
      await visit(dep, fromThirdParty)
    }
    visiting.delete(qualified)
    resolved.set(qualified, item)
  }

  for (const name of names) {
    await visit(name, false)
  }
  return Array.from(resolved.values())
}
