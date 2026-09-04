import path from "node:path"

import { intro, outro, spinner } from "@clack/prompts"

import {
  bundlerSchema,
  CONFIG_FILE_NAME,
  DEFAULT_BUNDLER,
  DEFAULT_COMPONENTS,
  DEFAULT_COMPOSABLES,
  DEFAULT_FRAMEWORK,
  DEFAULT_HOOKS,
  DEFAULT_LIB,
  DEFAULT_TAILWIND_CONFIG,
  DEFAULT_TAILWIND_CSS,
  DEFAULT_UI,
  DEFAULT_UTILS,
  frameworkSchema,
  rawConfigSchema,
  resolveConfigPaths,
  type Bundler,
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
  NEXT_CONFIG_CANDIDATES,
  NUXT_CONFIG_CANDIDATES,
  PROJECT_DEPENDENCIES_V3,
  PROJECT_DEPENDENCIES_V4,
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
  bundler?: Bundler
  registry?: string
}

/*
 * `cn` merges Tailwind classes in one compiled pass, but its tables are built
 * for Tailwind v4. A v3 project gets the `clsx` + `tailwind-merge` pair that
 * still understands v3 class names, so `init` writes whichever one matches the
 * major it detected.
 */
const UTILS_SOURCE_V4 = `export { cn } from "cn"
`

const UTILS_SOURCE_V3 = `import { type ClassValue, clsx } from "clsx"
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
    `Success! Project initialization completed. You may now add components: ${highlighter.info("npx newtui add button")}`
  )
}

/**
 * Decide whether this is a React or a Vue project from the config files it
 * has. A Nuxt or Vite config alone is not enough (Vite builds React apps too),
 * so a Next.js config wins first and the bundler check only runs afterwards.
 */
async function detectFramework(cwd: string): Promise<Framework> {
  if (findFirstExisting(cwd, NEXT_CONFIG_CANDIDATES)) return "react"
  if (findFirstExisting(cwd, NUXT_CONFIG_CANDIDATES)) return "vue"

  const packageJson = await readFileIfExists(path.resolve(cwd, "package.json"))
  if (packageJson !== null) {
    // Matching the raw text keeps this independent of where the dependency is
    // declared (`dependencies`, `devDependencies`, `peerDependencies`).
    if (/"(vue|nuxt)"\s*:/.test(packageJson)) return "vue"
    if (/"(react|next)"\s*:/.test(packageJson)) return "react"
  }

  if (findFirstExisting(cwd, VITE_CONFIG_CANDIDATES)) return "vue"
  return DEFAULT_FRAMEWORK
}

/** Vue only — Nuxt and Vite need different stylesheet paths and setup steps. */
function detectBundler(cwd: string): Bundler {
  if (findFirstExisting(cwd, NUXT_CONFIG_CANDIDATES)) return "nuxt"
  if (findFirstExisting(cwd, VITE_CONFIG_CANDIDATES)) return "vite"
  return DEFAULT_BUNDLER
}

function detectCssPath(
  cwd: string,
  framework: Framework,
  bundler: Bundler | undefined,
  override?: string
): string {
  const candidates =
    framework === "vue"
      ? CSS_CANDIDATES[bundler ?? DEFAULT_BUNDLER]
      : CSS_CANDIDATES.react
  return (
    override ??
    findFirstExisting(cwd, candidates) ??
    DEFAULT_TAILWIND_CSS[framework]
  )
}

function detectTailwindConfig(cwd: string): string {
  return (
    findFirstExisting(cwd, TAILWIND_CONFIG_CANDIDATES) ??
    DEFAULT_TAILWIND_CONFIG
  )
}

/**
 * Build the `components.json` defaults for a framework. Each framework only
 * carries the aliases its registry actually references.
 */
function buildDefaults(
  cwd: string,
  framework: Framework,
  bundler: Bundler | undefined,
  options: InitOptions
): RawConfig {
  // The fields that belong to only one framework are set to `undefined` for
  // the other, so `JSON.stringify` drops them from the written file.
  const isVue = framework === "vue"
  return rawConfigSchema.parse({
    $schema: "https://newtui.dev/schema.json",
    style: "default",
    framework,
    bundler: isVue ? (bundler ?? DEFAULT_BUNDLER) : undefined,
    typescript: true,
    rsc: isVue ? undefined : true,
    tailwind: {
      config: detectTailwindConfig(cwd),
      css: detectCssPath(cwd, framework, bundler, options.css),
      baseColor: "neutral",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: DEFAULT_COMPONENTS,
      utils: DEFAULT_UTILS,
      ui: DEFAULT_UI,
      lib: DEFAULT_LIB,
      hooks: isVue ? undefined : DEFAULT_HOOKS,
      composables: isVue ? DEFAULT_COMPOSABLES : undefined,
    },
    iconLibrary: "lucide",
  })
}

async function promptForConfig(
  cwd: string,
  options: InitOptions
): Promise<RawConfig> {
  const detectedFramework = options.framework ?? (await detectFramework(cwd))
  const detectedBundler =
    detectedFramework === "vue"
      ? (options.bundler ?? detectBundler(cwd))
      : undefined
  const defaults = buildDefaults(
    cwd,
    detectedFramework,
    detectedBundler,
    options
  )

  if (options.defaults || options.yes) return defaults

  const framework = frameworkSchema.parse(
    await promptSelect(
      `Which ${highlighter.info("framework")} are you using?`,
      [
        { value: "react", label: "React" },
        { value: "vue", label: "Vue" },
      ],
      defaults.framework
    )
  )
  const bundler =
    framework === "vue"
      ? bundlerSchema.parse(
          await promptSelect(
            `Which ${highlighter.info("build tool")} are you using?`,
            [
              { value: "nuxt", label: "Nuxt" },
              { value: "vite", label: "Vite" },
            ],
            detectedBundler ?? DEFAULT_BUNDLER
          )
        )
      : undefined

  // The framework may have changed, so re-derive the defaults it implies
  // (stylesheet path, aliases) before asking about them.
  const frameworkDefaults =
    framework === defaults.framework
      ? defaults
      : buildDefaults(cwd, framework, bundler, options)

  const typescript = await promptConfirm(
    `Would you like to use ${highlighter.info("TypeScript")} (recommended)?`
  )
  const rsc =
    framework === "react"
      ? await promptConfirm(
          `Are you using ${highlighter.info("React Server Components")}?`
        )
      : undefined
  const tailwindConfig = await promptText(
    `Where is your ${highlighter.info("tailwind.config")} located?`,
    frameworkDefaults.tailwind.config
  )
  const tailwindCss = await promptText(
    `Where is your ${highlighter.info("global CSS")} file?`,
    frameworkDefaults.tailwind.css
  )
  const components = await promptText(
    `Configure the import alias for ${highlighter.info("components")}:`,
    frameworkDefaults.aliases.components
  )
  const utils = await promptText(
    `Configure the import alias for ${highlighter.info("utils")}:`,
    frameworkDefaults.aliases.utils
  )

  const config: RawConfig = rawConfigSchema.parse({
    ...frameworkDefaults,
    framework,
    bundler,
    typescript,
    rsc,
    tailwind: {
      ...frameworkDefaults.tailwind,
      config: tailwindConfig,
      css: tailwindCss,
    },
    aliases: {
      ...frameworkDefaults.aliases,
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

  /* read before anything is written: it decides both the utils source and the deps */
  const cssPath = config.resolvedPaths.tailwindCss
  const major = await detectTailwindMajor(cwd, cssPath)

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
    const source =
      major === 4
        ? UTILS_SOURCE_V4
        : config.typescript
          ? UTILS_SOURCE_V3
          : UTILS_SOURCE_V3.replace("type ClassValue, ", "").replace(
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
  const existingCss = (await readFileIfExists(cssPath)) ?? ""
  const theme = await fetchTheme(
    config.framework,
    options.registry,
    config.style
  )
  if (existingCss.includes(TOKENS_MARKER)) {
    cssSpinner.stop(
      `${relativePath(cwd, cssPath)} already contains newt tokens, skipped.`
    )
  } else {
    const header =
      existingCss.length === 0 ? tailwindPreamble(major) : existingCss
    await writeFileAt(
      cssPath,
      header.replace(/\s*$/, "\n") + (await tokensCssBlock(theme, major))
    )
    cssSpinner.stop(
      `Added tokens to ${highlighter.info(relativePath(cwd, cssPath))} (Tailwind v${major}).`
    )
  }

  // dependencies
  if (!options.skipInstall) {
    await installDependencies(
      cwd,
      major === 4 ? [...PROJECT_DEPENDENCIES_V4] : [...PROJECT_DEPENDENCIES_V3]
    )
    logger.success("Installed dependencies.")
  }

  printTailwindInstructions(
    config.framework,
    config.tailwind.config,
    major,
    theme
  )
  if (config.framework === "vue") {
    if ((config.bundler ?? DEFAULT_BUNDLER) === "nuxt") {
      printNuxtInstructions(config.tailwind.css)
    } else {
      printViteInstructions(config.tailwind.css)
    }
  }
}

/**
 * The theme item carries the tokens in every shape the two Tailwind majors
 * need. It is fetched rather than derived so the values stay defined once, in
 * the registry. An unreachable registry is not fatal: the tokens bundled with
 * this package still cover the raw `--newt-*` variables, which is what a v3
 * project needs, and a v4 project is told what it is missing.
 */
async function fetchTheme(
  framework: Framework,
  registry: string | undefined,
  style: string
): Promise<RegistryItem | null> {
  try {
    return await getRegistryItem(
      getRegistryUrl(framework, registry),
      style,
      THEME_ITEM
    )
  } catch {
    return null
  }
}

async function tokensCssBlock(
  theme: RegistryItem | null,
  major: TailwindMajor
): Promise<string> {
  const rendered = theme ? renderItemCss(theme, major) : ""
  if (rendered.length > 0) {
    return [
      "",
      "/* newt/ui design tokens — source: the newt/ui registry theme item */",
      rendered,
    ].join("\n")
  }
  // Offline fallback: the `:root` block shipped inside this package.
  return getTokensCssBlock()
}

function printTailwindInstructions(
  framework: Framework,
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
        `The registry was unreachable, so only the raw ${highlighter.info("--newt-*")} variables were written. Re-run ${highlighter.info("newtui init")} when you are online to add the @theme block.`
      )
    }
    return
  }

  const extend = theme?.tailwind?.config?.theme?.extend
  if (!extend) {
    logger.warn(
      `The registry was unreachable, so the v3 preset could not be printed. Re-run ${highlighter.info("newtui init")} when you are online.`
    )
    return
  }

  const content =
    framework === "vue"
      ? `["./src/**/*.{vue,ts}"]`
      : `["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"]`

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
    content: ${content},
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
      "  Tip: @newtui/nuxt auto-imports every component in your ui directory — see https://newtui.dev"
    )
  )
}

function printViteInstructions(css: string): void {
  logger.log(highlighter.bold("Vite setup"))
  logger.log(
    `Import ${highlighter.info(css)} from your app entry (usually ${highlighter.info("src/main.ts")}).`
  )
}
