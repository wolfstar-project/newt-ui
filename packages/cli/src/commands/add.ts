import { intro, outro, spinner } from "@clack/prompts"

import { preflightAdd } from "../preflights/preflight-add.js"
import {
  getRegistryIndex,
  getRegistryUrl,
  resolveTree,
} from "../registry/api.js"
import type { RegistryItem } from "../schema/index.js"
import type { Config } from "../utils/get-config.js"
import { highlighter, logger } from "../utils/logger.js"
import { promptConfirm, promptMultiselect } from "../utils/prompts.js"
import { updateCss } from "../utils/updaters/update-css.js"
import { updateDependencies } from "../utils/updaters/update-dependencies.js"
import { updateFiles } from "../utils/updaters/update-files.js"

export interface AddOptions {
  components: string[]
  cwd: string
  yes: boolean
  overwrite: boolean
  all: boolean
  path?: string
  registry?: string
  skipInstall: boolean
}

export async function add(options: AddOptions): Promise<void> {
  const config = await preflightAdd(options)

  intro(highlighter.bold("newt/ui — add"))

  const registryUrl = getRegistryUrl(
    config.framework,
    options.registry ?? config.registry
  )
  let selected = options.components

  if (options.all || selected.length === 0) {
    const index = await getRegistryIndex(registryUrl)
    const uiItems = index.filter((item) => item.type === "registry:ui")
    selected = options.all
      ? uiItems.map((item) => item.name)
      : await promptMultiselect(
          "Which components would you like to add?",
          uiItems.map((item) => ({
            value: item.name,
            label: item.title ?? item.name,
          }))
        )
  }

  if (selected.length === 0) {
    logger.warn("No components selected. Exiting.")
    process.exit(0)
  }

  await runAdd(config, registryUrl, selected, options)
}

async function runAdd(
  config: Config,
  registryUrl: string,
  names: string[],
  options: {
    yes: boolean
    overwrite: boolean
    path?: string
    skipInstall: boolean
  }
): Promise<void> {
  const resolveSpinner = spinner()
  resolveSpinner.start("Resolving registry dependencies...")
  let tree: RegistryItem[]
  try {
    tree = await resolveTree(registryUrl, config.style, names)
  } catch (error) {
    resolveSpinner.stop("Failed to resolve components.")
    throw error
  }
  resolveSpinner.stop(
    `Resolved ${tree.length} item(s): ${tree.map((item) => item.name).join(", ")}`
  )

  if (!options.yes) {
    const proceed = await promptConfirm(
      "Ready to install components and dependencies. Proceed?"
    )
    if (!proceed) process.exit(0)
  }

  const { written, skipped } = await updateFiles(tree, config, options)
  await updateCss(tree, config)

  for (const file of written) logger.success(`+ ${file}`)
  for (const file of skipped)
    logger.warn(`~ ${file} (skipped, use --overwrite to replace)`)

  await updateDependencies(tree, config, options)

  const uiAlias = config.aliases.ui ?? `${config.aliases.components}/ui`
  logger.log(
    tree
      .map((item) =>
        highlighter.dim(
          `import { ... } from "${item.type === "registry:block" ? config.aliases.components : uiAlias}/${item.name}"`
        )
      )
      .join("\n")
  )
  outro("Done.")
}
