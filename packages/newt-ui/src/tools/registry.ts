import {
  registryIndexSchema,
  registryItemSchema,
  type RegistryIndex,
  type RegistryItem,
} from "./schema.js"

const DEFAULT_REGISTRY_URL = "https://wolfstar-project.github.io/newt-ui/r"

export function getRegistryUrl(override?: string): string {
  const url = override ?? process.env.NEWT_REGISTRY_URL ?? DEFAULT_REGISTRY_URL
  return url.replace(/\/+$/, "")
}

/** The domain shape of a parsed JSON document, before schema validation. */
type JsonValue =
  | boolean
  | number
  | string
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

async function fetchJson(url: string): Promise<JsonValue> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${url} (${response.status} ${response.statusText}).`
    )
  }
  return response.json()
}

export async function getRegistryIndex(
  registryUrl: string
): Promise<RegistryIndex> {
  const data = await fetchJson(`${registryUrl}/index.json`)
  return registryIndexSchema.parse(data)
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
  let data: unknown
  try {
    data = await fetchJson(url)
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(`Component "${name}" not found in registry.\n${detail}`, {
      cause: error,
    })
  }
  const parsed = registryItemSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(`Invalid registry item "${name}": ${parsed.error.message}`)
  }
  return parsed.data
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
