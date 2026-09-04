import { intro, outro } from "@clack/prompts"

import { getConfig } from "../tools/config.js"
import {
  pathExists,
  readTextFile,
  relativePath,
  resolveCwd,
} from "../tools/fileSystem.js"
import { highlighter, logger } from "../tools/logger.js"
import { getRegistryItem, getRegistryUrl } from "../tools/registry.js"
import {
  normalizeFile,
  resolveTargetPath,
  transformContent,
} from "../tools/transformers.js"

export interface DiffOptions {
  component?: string
  cwd: string
  registry?: string
}

export async function diff(options: DiffOptions): Promise<void> {
  const cwd = resolveCwd(options.cwd)
  const config = await getConfig(cwd)
  if (!config) {
    throw new Error(
      `Configuration is missing. Please run ${highlighter.info("npx newtui init")} first.`
    )
  }
  if (!options.component) {
    throw new Error(
      "Please specify a component name, e.g. `newtui diff button`."
    )
  }

  intro(highlighter.bold("newt/ui — diff"))

  const registryUrl = getRegistryUrl(
    config.framework,
    options.registry ?? config.registry
  )
  const item = await getRegistryItem(
    registryUrl,
    config.style,
    options.component
  )

  let changed = 0
  for (const rawFile of item.files ?? []) {
    const file = normalizeFile(rawFile, item.type)
    if (!file) continue
    const target = resolveTargetPath(file, item, config)
    const relative = relativePath(cwd, target)
    if (!pathExists(target)) {
      logger.warn(`${relative}: not installed`)
      changed++
      continue
    }
    const local = await readTextFile(target)
    const remote = transformContent(file.content, config)
    if (local === remote) {
      logger.success(`${relative}: up to date`)
      continue
    }
    changed++
    logger.info(`${relative}: differs`)
    printLineDiff(local, remote)
  }

  if (changed === 0) {
    outro(highlighter.success("No updates found."))
    return
  }
  outro(
    highlighter.dim(
      `Run ${highlighter.info(`npx newtui add ${item.name} --overwrite`)} to update.`
    )
  )
}

function printLineDiff(local: string, remote: string): void {
  const a = local.split("\n")
  const b = remote.split("\n")
  const max = Math.max(a.length, b.length)
  const lines: string[] = []
  let shown = 0
  for (let i = 0; i < max && shown < 40; i++) {
    const left = a[i]
    const right = b[i]
    if (left === right) continue
    if (left !== undefined) lines.push(highlighter.error(`- ${left}`))
    if (right !== undefined) lines.push(highlighter.success(`+ ${right}`))
    shown++
  }
  if (shown >= 40) lines.push(highlighter.dim("... (truncated)"))
  if (lines.length > 0) logger.log(lines.join("\n"))
}
