import path from "node:path"

import { intro, outro, spinner } from "@clack/prompts"

import { getConfig, type Config } from "../tools/config.js"
import {
  pathExists,
  readFileIfExists,
  relativePath,
  resolveCwd,
  writeFileAt,
} from "../tools/fileSystem.js"
import { highlighter, logger } from "../tools/logger.js"
import { installDependencies } from "../tools/packageManager.js"
import { promptConfirm, promptMultiselect } from "../tools/prompts.js"
import {
  getRegistryIndex,
  getRegistryUrl,
  resolveTree,
} from "../tools/registry.js"
import type { RegistryItem } from "../tools/schema.js"
import { detectTailwindMajor, renderItemCss } from "../tools/tailwind.js"
import {
  normalizeFile,
  resolveTargetPath,
  transformContent,
} from "../tools/transformers.js"

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
  const cwd = resolveCwd(options.cwd)

  const config = await getConfig(cwd)
  if (!config) {
    throw new Error(
      `Configuration is missing. Please run ${highlighter.info("npx @newtui/vue init")} to create a components.json file.`
    )
  }

  intro(highlighter.bold("newt/ui — add"))

  const registryUrl = getRegistryUrl(options.registry ?? config.registry)
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

  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()
  const written: string[] = []
  const skipped: string[] = []

  for (const item of tree) {
    for (const dep of item.dependencies ?? []) dependencies.add(dep)
    for (const dep of item.devDependencies ?? []) devDependencies.add(dep)

    for (const rawFile of item.files ?? []) {
      const file = normalizeFile(rawFile, item.type)
      if (!file) continue

      // Vue components are directories (`ui/button/Button.vue`), so `--path`
      // keeps the component directory instead of flattening to a file name.
      let target = resolveTargetPath(file, item, config)
      if (options.path && !file.target) {
        const relative = relativePath(config.resolvedPaths.ui, target)
        const inUiDir = !relative.startsWith("..") && !path.isAbsolute(relative)
        target = path.resolve(
          config.resolvedPaths.cwd,
          options.path,
          inUiDir ? relative : path.basename(target)
        )
      }

      if (pathExists(target) && !options.overwrite) {
        const relative = relativePath(config.resolvedPaths.cwd, target)
        if (options.yes) {
          skipped.push(relative)
          continue
        }
        const overwrite = await promptConfirm(
          `File ${highlighter.info(relative)} already exists. Overwrite?`,
          false
        )
        if (!overwrite) {
          skipped.push(relative)
          continue
        }
      }

      await writeFileAt(target, transformContent(file.content, config))
      written.push(relativePath(config.resolvedPaths.cwd, target))
    }
  }

  await applyItemStyles(tree, config)

  for (const file of written) logger.success(`+ ${file}`)
  for (const file of skipped)
    logger.warn(`~ ${file} (skipped, use --overwrite to replace)`)

  if (!options.skipInstall) {
    if (dependencies.size > 0) {
      logger.info(
        `Installing dependencies: ${Array.from(dependencies).join(", ")}`
      )
      await installDependencies(
        config.resolvedPaths.cwd,
        Array.from(dependencies)
      )
    }
    if (devDependencies.size > 0) {
      logger.info(
        `Installing devDependencies: ${Array.from(devDependencies).join(", ")}`
      )
      await installDependencies(
        config.resolvedPaths.cwd,
        Array.from(devDependencies),
        { dev: true }
      )
    }
  } else if (dependencies.size > 0 || devDependencies.size > 0) {
    logger.warn(
      `Skipped install. Dependencies: ${[...dependencies, ...devDependencies].join(", ")}`
    )
  }

  const uiAlias = config.aliases.ui ?? `${config.aliases.components}/ui`
  logger.log(
    tree
      .map((item) =>
        highlighter.dim(`import { ... } from "${uiAlias}/${item.name}"`)
      )
      .join("\n")
  )
  outro("Done.")
}

/**
 * Append any `cssVars` / `css` an item carries to the project stylesheet,
 * rendered for whichever Tailwind major the project is on. Most components
 * need nothing here — they are styled by the tokens `init` wrote.
 */
async function applyItemStyles(
  items: RegistryItem[],
  config: Config
): Promise<void> {
  const styled = items.filter((item) => item.cssVars ?? item.css)
  if (styled.length === 0) return

  const cssPath = config.resolvedPaths.tailwindCss
  const existing = (await readFileIfExists(cssPath)) ?? ""
  const major = await detectTailwindMajor(config.resolvedPaths.cwd, cssPath)

  const additions: string[] = []
  for (const item of styled) {
    const rendered = renderItemCss(item, major)
    if (rendered.length === 0) continue
    if (existing.includes(rendered.trim())) continue
    additions.push(`/* newt/ui — ${item.name} */\n${rendered}`)
  }
  if (additions.length === 0) return

  await writeFileAt(
    cssPath,
    `${existing.replace(/\s*$/, "\n")}\n${additions.join("\n")}`
  )
  logger.success(
    `+ ${relativePath(config.resolvedPaths.cwd, cssPath)} (styles)`
  )
}
