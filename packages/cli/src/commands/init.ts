import path from "node:path"

import { intro, outro, spinner } from "@clack/prompts"

import {
  CONFIG_FILE_NAME,
  DEFAULT_COMPONENTS,
  DEFAULT_COMPOSABLES,
  DEFAULT_FRAMEWORK,
  DEFAULT_LIB,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_UI,
  DEFAULT_UTILS,
  frameworkSchema,
  rawConfigSchema,
  resolveConfigPaths,
  type Framework,
  type RawConfig,
} from "../tools/config.js"
import {
  findFirstExisting,
  pathExists,
  readFileIfExists,
  relativePath,
  resolveCwd,
  writeFileAt,
} from "../tools/fileSystem.js"
import { highlighter, logger } from "../tools/logger.js"
import {
  CSS_CANDIDATES,
  NUXT_CONFIG_CANDIDATES,
  PROJECT_DEPENDENCIES,
  TAILWIND_CONFIG_CANDIDATES,
  VITE_CONFIG_CANDIDATES,
} from "../tools/options.js"
import { installDependencies } from "../tools/packageManager.js"
import { promptConfirm, promptSelect, promptText } from "../tools/prompts.js"
import { getRegistryItem, getRegistryUrl } from "../tools/registry.js"
import type { RegistryItem } from "../tools/schema.js"
import {
  detectTailwindMajor,
  renderItemCss,
  tailwindPreamble,
  type TailwindMajor,
} from "../tools/tailwind.js"
import { getTokensCssBlock, TOKENS_MARKER } from "../tools/tokens.js"

/** The registry item that carries the design tokens. */
const THEME_ITEM = "theme-newt"

export interface InitOptions {
  cwd: string
  yes: boolean
  defaults: boolean
  skipInstall: boolean
  css?: string
  framework?: Framework
  registry?: string
}

const UTILS_SOURCE = `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`

export async function init(options: InitOptions): Promise<void> {
  const cwd = resolveCwd(options.cwd)
  intro(highlighter.bold("newt/ui — init"))
  const config = await promptForConfig(cwd, options)
  await runInit(cwd, config, options)
  outro(
    `Success! Project initialization completed. You may now add components: ${highlighter.info("npx newt-ui-vue add button")}`
  )
}

function detectFramework(cwd: string): Framework {
  if (findFirstExisting(cwd, NUXT_CONFIG_CANDIDATES)) return "nuxt"
  if (findFirstExisting(cwd, VITE_CONFIG_CANDIDATES)) return "vite"
  return DEFAULT_FRAMEWORK
}

function detectCssPath(
  cwd: string,
  framework: Framework,
  override?: string
): string {
  return (
    override ??
    findFirstExisting(cwd, CSS_CANDIDATES[framework]) ??
    DEFAULT_TAILWIND_CSS
  )
}

function detectTailwindConfig(cwd: string): string {
  return (
    findFirstExisting(cwd, TAILWIND_CONFIG_CANDIDATES) ??
    DEFAULT_TAILWIND_CONFIG
  )
}

async function promptForConfig(
  cwd: string,
  options: InitOptions
): Promise<RawConfig> {
  const framework = options.framework ?? detectFramework(cwd)
  const defaults: RawConfig = rawConfigSchema.parse({
    $schema: "https://newt-devs.github.io/newt-ui/schema.json",
    style: "default",
    typescript: true,
    framework,
    tailwind: {
      config: detectTailwindConfig(cwd),
      css: detectCssPath(cwd, framework, options.css),
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: DEFAULT_COMPONENTS,
      utils: DEFAULT_UTILS,
      ui: DEFAULT_UI,
      lib: DEFAULT_LIB,
      composables: DEFAULT_COMPOSABLES,
    },
    iconLibrary: "lucide",
  })

  if (options.defaults || options.yes) return defaults

  const typescript = await promptConfirm(
    `Would you like to use ${highlighter.info("TypeScript")} (recommended)?`
  )
  const selectedFramework = await promptSelect(
    `Which ${highlighter.info("framework")} are you using?`,
    [
      { value: "nuxt", label: "Nuxt" },
      { value: "vite", label: "Vite" },
    ],
    defaults.framework
  )
  const tailwindConfig = await promptText(
    `Where is your ${highlighter.info("tailwind.config")} located?`,
    defaults.tailwind.config
  )
  const tailwindCss = await promptText(
    `Where is your ${highlighter.info("global CSS")} file?`,
    defaults.tailwind.css
  )
  const components = await promptText(
    `Configure the import alias for ${highlighter.info("components")}:`,
    defaults.aliases.components
  )
  const utils = await promptText(
    `Configure the import alias for ${highlighter.info("utils")}:`,
    defaults.aliases.utils
  )

  const config: RawConfig = rawConfigSchema.parse({
    ...defaults,
    typescript,
    framework: frameworkSchema.parse(selectedFramework),
    tailwind: {
      ...defaults.tailwind,
      config: tailwindConfig,
      css: tailwindCss,
    },
    aliases: {
      ...defaults.aliases,
      components,
      utils,
      ui: `${components}/ui`,
    },
  })

  const proceed = await promptConfirm(
    `Write configuration to ${highlighter.info(CONFIG_FILE_NAME)}. Proceed?`
  )
  if (!proceed) process.exit(0)
  return config
}

async function runInit(
  cwd: string,
  rawConfig: RawConfig,
  options: { skipInstall: boolean; registry?: string }
): Promise<void> {
  const configSpinner = spinner()
  configSpinner.start("Writing components.json...")
  const configPath = path.resolve(cwd, CONFIG_FILE_NAME)
  await writeFileAt(configPath, JSON.stringify(rawConfig, null, 2) + "\n")
  configSpinner.stop(`Wrote ${highlighter.info(CONFIG_FILE_NAME)}.`)

  const config = await resolveConfigPaths(cwd, rawConfig)

  // lib/utils.ts
  const utilsSpinner = spinner()
  utilsSpinner.start("Writing lib/utils...")
  const utilsExt = config.typescript ? "ts" : "js"
  const utilsPath = `${config.resolvedPaths.utils}.${utilsExt}`
  if (pathExists(utilsPath)) {
    utilsSpinner.stop(
      `${relativePath(cwd, utilsPath)} already exists, skipped.`
    )
  } else {
    const source = config.typescript
      ? UTILS_SOURCE
      : UTILS_SOURCE.replace("type ClassValue, ", "").replace(
          ": ClassValue[]",
          ""
        )
    await writeFileAt(utilsPath, source)
    utilsSpinner.stop(
      `Wrote ${highlighter.info(relativePath(cwd, utilsPath))}.`
    )
  }

  // tokens -> global css
  const cssSpinner = spinner()
  cssSpinner.start("Adding newt/ui design tokens to CSS...")
  const cssPath = config.resolvedPaths.tailwindCss
  const existingCss = (await readFileIfExists(cssPath)) ?? ""
  const major = await detectTailwindMajor(cwd, cssPath)
  const theme = await fetchTheme(options.registry, config.style)
  if (existingCss.includes(TOKENS_MARKER)) {
    cssSpinner.stop(
      `${relativePath(cwd, cssPath)} already contains newt tokens, skipped.`
    )
  } else {
    const header =
      existingCss.length === 0 ? tailwindPreamble(major) : existingCss
    await writeFileAt(
      cssPath,
      header.replace(/\s*$/, "\n") + tokensCssBlock(theme, major)
    )
    cssSpinner.stop(
      `Added tokens to ${highlighter.info(relativePath(cwd, cssPath))} (Tailwind v${major}).`
    )
  }

  // dependencies
  if (!options.skipInstall) {
    await installDependencies(cwd, [...PROJECT_DEPENDENCIES])
    logger.success("Installed dependencies.")
  }

  printTailwindInstructions(config.tailwind.config, major, theme)
  if (config.framework === "nuxt") {
    printNuxtInstructions(config.tailwind.css)
  } else {
    printViteInstructions(config.tailwind.css)
  }
}

/**
 * The theme item carries the tokens in every shape the two Tailwind majors
 * need. It is fetched rather than derived so the values stay defined once, in
 * the registry. An unreachable registry is not fatal: the tokens bundled with
 * this package still cover the raw `--newt-*` variables.
 */
async function fetchTheme(
  registry: string | undefined,
  style: string
): Promise<RegistryItem | null> {
  try {
    return await getRegistryItem(getRegistryUrl(registry), style, THEME_ITEM)
  } catch {
    return null
  }
}

function tokensCssBlock(
  theme: RegistryItem | null,
  major: TailwindMajor
): string {
  const rendered = theme ? renderItemCss(theme, major) : ""
  if (rendered.length > 0) {
    return [
      "",
      "/* newt/ui design tokens — source: the newt/ui registry theme item */",
      rendered,
    ].join("\n")
  }
  return getTokensCssBlock()
}

function printTailwindInstructions(
  tailwindConfig: string,
  major: TailwindMajor,
  theme: RegistryItem | null
): void {
  logger.log(highlighter.bold("Tailwind setup"))

  if (major === 4) {
    logger.log(
      `Nothing else to configure — Tailwind v4 reads the ${highlighter.info("@theme")} block just written to your stylesheet, which is what generates ${highlighter.info("bg-newt-bg-elevated")}, ${highlighter.info("rounded-md")} and the rest.`
    )
    if (!theme) {
      logger.warn(
        `The registry was unreachable, so only the raw ${highlighter.info("--newt-*")} variables were written. Re-run ${highlighter.info("newt-ui-vue init")} when you are online to add the @theme block.`
      )
    }
    return
  }

  const extend = theme?.tailwind?.config?.theme?.extend
  if (!extend) {
    logger.warn(
      `The registry was unreachable, so the v3 preset could not be printed. Re-run ${highlighter.info("newt-ui-vue init")} when you are online.`
    )
    return
  }

  logger.log(
    `Add the newt/ui preset to ${highlighter.info(tailwindConfig)} so utilities like ${highlighter.info("bg-newt-bg-elevated")} and ${highlighter.info("text-newt-brand")} map to the --newt-* tokens:`
  )
  logger.log(
    highlighter.dim(`  import type { Config } from "tailwindcss"

  const newtPreset = {
    darkMode: ["class"],
    theme: { extend: ${JSON.stringify(extend, null, 2).split("\n").join("\n    ")} },
  } satisfies Omit<Config, "content">

  export default {
    presets: [newtPreset],
    content: ["./src/**/*.{vue,ts}"],
    plugins: [require("tailwindcss-animate")],
  } satisfies Config`)
  )
}

function printNuxtInstructions(css: string): void {
  logger.log(highlighter.bold("Nuxt setup"))
  logger.log(
    `Make sure ${highlighter.info("@nuxtjs/tailwindcss")} is registered and your CSS entry is loaded in ${highlighter.info("nuxt.config.ts")}:`
  )
  logger.log(
    highlighter.dim(`  export default defineNuxtConfig({
    modules: ["@nuxtjs/tailwindcss"],
    css: ["~/${css.replace(/^src\//, "")}"],
  })`)
  )
  logger.log(
    highlighter.dim(
      "  Tip: @newt-devs/nuxt auto-imports every component in your ui directory — see https://newt-devs.github.io/newt-ui"
    )
  )
}

function printViteInstructions(css: string): void {
  logger.log(highlighter.bold("Vite setup"))
  logger.log(
    `Import ${highlighter.info(css)} from your app entry (usually ${highlighter.info("src/main.ts")}).`
  )
}
