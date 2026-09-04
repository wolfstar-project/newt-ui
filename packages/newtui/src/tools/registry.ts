import { z } from "zod"

import type { Framework } from "./config.js"
import {
  registryIndexSchema,
  registryItemSchema,
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
async function fetchJson<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const response = await fetch(url)
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

/**
 * Resolve the full dependency tree for the given names (including transitive
 * `registryDependencies`) and return items in install order (deps first).
 */
export async function resolveTree(
  registryUrl: string,
  style: string,
  names: string[]
): Promise<RegistryItem[]> {
  const resolved = new Map<string, RegistryItem>()
  const visiting = new Set<string>()

  async function visit(name: string): Promise<void> {
    if (resolved.has(name) || visiting.has(name)) return
    visiting.add(name)
    const item = await getRegistryItem(registryUrl, style, name)
    for (const dep of item.registryDependencies ?? []) {
      await visit(dep)
    }
    visiting.delete(name)
    resolved.set(name, item)
  }

  for (const name of names) {
    await visit(name)
  }
  return Array.from(resolved.values())
}
