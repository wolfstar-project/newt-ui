import { intro, outro } from "@clack/prompts"

import { getRawConfig } from "../tools/config.js"
import { resolveCwd } from "../tools/fileSystem.js"
import { highlighter, logger } from "../tools/logger.js"
import { getRegistryIndex, getRegistryUrl } from "../tools/registry.js"

export interface ListOptions {
  cwd: string
  registry?: string
  type?: string
  json: boolean
}

export async function list(options: ListOptions): Promise<void> {
  const cwd = resolveCwd(options.cwd)
  const config = await getRawConfig(cwd).catch(() => null)
  const registryUrl = getRegistryUrl(options.registry ?? config?.registry)
  const index = await getRegistryIndex(registryUrl)
  const filter = options.type ?? "registry:ui"
  const items = index.filter((item) => filter === "all" || item.type === filter)

  if (options.json) {
    console.log(JSON.stringify(items, null, 2))
    return
  }

  intro(highlighter.bold(`Registry: ${registryUrl}`))
  for (const item of items) {
    const title = item.title ?? item.name
    const description = item.description
      ? highlighter.dim(` — ${item.description}`)
      : ""
    logger.log(
      `${highlighter.info(item.name.padEnd(22))} ${title}${description}`
    )
  }
  outro(
    highlighter.dim(
      `${items.length} item(s). Add with: npx @newtui/vue add <name>`
    )
  )
}
