import { intro, outro } from "@clack/prompts"

import { getRegistryUrl, resolveTree } from "../registry/api.js"
import { relativePath, resolveCwd } from "../utils/fileSystem.js"
import { getConfig } from "../utils/get-config.js"
import { highlighter, logger } from "../utils/logger.js"
import {
  allThemeNames,
  missingThemeNames,
  renderThemeNames,
  themeNameList,
  themeNamesUsed,
} from "../utils/theme-names.js"
import {
  fetchThemeCatalogue,
  itemSources,
  readProjectTheme,
  writeMissingThemeNames,
} from "../utils/updaters/update-theme-names.js"

export interface TokensOptions {
  /** Limit the check to the names these components use. Empty: the whole theme. */
  components: string[]
  cwd: string
  registry?: string
  /** Print what is missing, write nothing. */
  dryRun: boolean
}

/**
 * Add the theme names the project's stylesheet lacks, and only those. A
 * second run finds nothing missing and writes nothing, so it is safe to run
 * after every upgrade.
 */
export async function tokens(options: TokensOptions): Promise<void> {
  const cwd = resolveCwd(options.cwd)
  const config = await getConfig(cwd)
  if (!config) {
    throw new Error(
      `Configuration is missing. Please run ${highlighter.info("npx newtui init")} first.`
    )
  }

  intro(highlighter.bold("newt/ui — tokens"))

  const registryUrl = getRegistryUrl(
    config.framework,
    options.registry ?? config.registry
  )
  const catalogue = await fetchThemeCatalogue(registryUrl, config.style)
  if (catalogue === undefined) {
    throw new Error(
      `The registry at ${registryUrl} did not serve the theme. Check the URL, or pass ${highlighter.info("--registry")}.`
    )
  }

  const wanted =
    options.components.length === 0
      ? allThemeNames(catalogue)
      : themeNamesUsed(
          catalogue,
          itemSources(
            await resolveTree(
              {
                registryUrl,
                style: config.style,
                framework: config.framework,
                registries: config.registries,
              },
              options.components
            )
          )
        )
  const project = await readProjectTheme(config)
  const missing = missingThemeNames(wanted, project)
  const names = themeNameList(missing)
  const stylesheet = relativePath(cwd, config.resolvedPaths.tailwindCss)
  const tailwindConfig = relativePath(cwd, config.resolvedPaths.tailwindConfig)

  if (names.length === 0) {
    outro(highlighter.success("Your project declares every theme name."))
    return
  }

  logger.info(`Missing (${names.length}): ${names.join(", ")}`)

  if (options.dryRun) {
    const rendered = renderThemeNames(
      missing,
      catalogue,
      project.major,
      config.tailwind.darkSelector
    )
    if (rendered.css.length > 0) {
      logger.log(`This block would go into ${highlighter.info(stylesheet)}:`)
      logger.log(highlighter.dim(rendered.css.trimEnd()))
    }
    printConfigEntries(rendered.config, tailwindConfig)
    outro("Dry run: nothing was written.")
    return
  }

  const result = await writeMissingThemeNames(
    missing,
    catalogue,
    project,
    config
  )
  if (result.written) logger.success(`+ ${stylesheet} (theme names)`)
  printConfigEntries(result.config, tailwindConfig)
  outro("Done.")
}

/** Tailwind v3 reads its theme from JavaScript, which newtui does not edit. */
function printConfigEntries(
  entries: string | undefined,
  tailwindConfig: string
): void {
  if (entries === undefined) return
  logger.log(
    `Add these entries to ${highlighter.info("theme.extend")} in ${highlighter.info(tailwindConfig)}:`
  )
  logger.log(highlighter.dim(entries))
}
