import { intro, outro } from "@clack/prompts"

import {
  DEFAULT_FRAMEWORK,
  getRawConfig,
  type Framework,
} from "../tools/config.js"
import { resolveCwd } from "../tools/fileSystem.js"
import { highlighter, logger } from "../tools/logger.js"
import { getRegistryIndex, getRegistryUrl } from "../tools/registry.js"
import type { RegistryIndex } from "../tools/schema.js"

export interface SearchOptions {
  query?: string
  cwd: string
  registry?: string
  /** Which registry to search; falls back to the project's `components.json`. */
  framework?: Framework
  type?: string
  json: boolean
}

/**
 * Case-insensitive across the three fields a reader would search by. A blank
 * query matches everything, which makes `search` a superset of `list` rather
 * than a second thing to learn.
 */
function matches(item: RegistryIndex[number], query: string): boolean {
  if (query === "") return true
  const haystack =
    `${item.name} ${item.title ?? ""} ${item.description ?? ""}`.toLowerCase()
  return haystack.includes(query)
}

export async function search(options: SearchOptions): Promise<void> {
  const cwd = resolveCwd(options.cwd)
  const config = await getRawConfig(cwd).catch(() => null)
  const framework = options.framework ?? config?.framework ?? DEFAULT_FRAMEWORK
  const registryUrl = getRegistryUrl(
    framework,
    options.registry ?? config?.registry
  )

  const index = await getRegistryIndex(registryUrl)
  const query = (options.query ?? "").trim().toLowerCase()
  const filter = options.type ?? "registry:ui"
  const items = index.filter(
    (item) => (filter === "all" || item.type === filter) && matches(item, query)
  )

  if (options.json) {
    console.log(JSON.stringify(items, null, 2))
    return
  }

  intro(
    highlighter.bold(
      query === ""
        ? `Registry: ${registryUrl} (${framework})`
        : `Registry: ${registryUrl} (${framework}) — "${query}"`
    )
  )
  for (const item of items) {
    logger.info(
      `${highlighter.info(item.name)}  ${item.description ?? item.title ?? ""}`
    )
  }
  outro(
    items.length === 0
      ? "Nothing matched. Try a shorter query, or --type all."
      : `${items.length} item${items.length === 1 ? "" : "s"}. Install one with ${highlighter.info("newtui add <name>")}.`
  )
}
