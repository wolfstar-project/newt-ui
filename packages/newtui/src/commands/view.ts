import { intro, outro } from "@clack/prompts"
import { z } from "zod"

import {
  DEFAULT_FRAMEWORK,
  getRawConfig,
  type Framework,
} from "../tools/config.js"
import { resolveCwd } from "../tools/fileSystem.js"
import { highlighter, logger } from "../tools/logger.js"
import { getRegistryItem, getRegistryUrl } from "../tools/registry.js"
import type { RegistryItem, RegistryItemFile } from "../tools/schema.js"

export interface ViewOptions {
  components: string[]
  cwd: string
  registry?: string
  framework?: Framework
  json: boolean
}

const DEFAULT_STYLE = "default"

interface DescribedFile {
  path: string
  content: string
}

/*
 * A file entry is either a bare path — the shape the index uses — or an object
 * carrying the contents. Parsing it into one shape here means the printer below
 * never has to ask which it got.
 */
const describedFileSchema = z.union([
  z.string().transform((path): DescribedFile => ({ path, content: "" })),
  z
    .object({ path: z.string(), content: z.string().optional() })
    .transform(({ path, content }): DescribedFile => ({
      path,
      content: content ?? "",
    })),
])

function describeFile(file: RegistryItemFile): DescribedFile {
  return describedFileSchema.parse(file)
}

/**
 * Print a component without installing it. `add` writes files and edits a
 * project; this is the read-only half, for deciding whether you want it and
 * for an agent that needs the source without touching the tree.
 */
export async function view(options: ViewOptions): Promise<void> {
  if (options.components.length === 0) {
    logger.error("Name at least one component: `newtui view button`.")
    process.exitCode = 1
    return
  }

  const cwd = resolveCwd(options.cwd)
  const config = await getRawConfig(cwd).catch(() => null)
  const framework = options.framework ?? config?.framework ?? DEFAULT_FRAMEWORK
  const registryUrl = getRegistryUrl(
    framework,
    options.registry ?? config?.registry
  )
  const style = config?.style ?? DEFAULT_STYLE

  const items: RegistryItem[] = []
  for (const name of options.components) {
    items.push(await getRegistryItem(registryUrl, style, name))
  }

  if (options.json) {
    console.log(JSON.stringify(items, null, 2))
    return
  }

  intro(highlighter.bold(`Registry: ${registryUrl} (${framework})`))
  for (const item of items) {
    logger.info(highlighter.bold(item.title ?? item.name))
    if (item.description) logger.info(item.description)
    if (item.dependencies?.length) {
      logger.info(`dependencies: ${item.dependencies.join(", ")}`)
    }
    if (item.registryDependencies?.length) {
      logger.info(`registry: ${item.registryDependencies.join(", ")}`)
    }
    for (const file of item.files ?? []) {
      const { path, content } = describeFile(file)
      logger.break()
      logger.info(highlighter.info(path))
      if (content !== "") console.log(content)
    }
    logger.break()
  }
  outro(
    `Install with ${highlighter.info(`newtui add ${options.components.join(" ")}`)}.`
  )
}
