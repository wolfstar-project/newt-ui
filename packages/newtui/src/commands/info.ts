import { existsSync } from "node:fs"
import { readdir } from "node:fs/promises"
import path from "node:path"

import { intro, outro } from "@clack/prompts"

import {
  DEFAULT_FRAMEWORK,
  getConfig,
  type Bundler,
  type Config,
  type Framework,
} from "../tools/config.js"
import { resolveCwd } from "../tools/fileSystem.js"
import { highlighter, logger } from "../tools/logger.js"
import { getRegistryIndex, getRegistryUrl } from "../tools/registry.js"
import { detectTailwindMajor, type TailwindMajor } from "../tools/tailwind.js"

/**
 * Everything a tool needs to know about a project before it writes anything:
 * which framework and Tailwind major it is on, where its aliases point, and
 * which components it already has. The skill and the MCP server both read this
 * rather than guessing from the file tree.
 */
export interface ProjectAliases {
  components: string
  ui: string
  utils: string
  lib: string
  hooks: string
  composables: string
}

export interface ProjectInfo {
  framework: Framework
  bundler?: Bundler
  typescript: boolean
  tailwind: { version: TailwindMajor; css: string; config?: string }
  aliases: ProjectAliases
  registry: string
  installed: string[]
  cli: string
}

export interface InfoOptions {
  cwd: string
  registry?: string
  json: boolean
}

function readAliases(config: Config): ProjectAliases {
  return {
    components: config.aliases.components,
    ui: config.aliases.ui ?? `${config.aliases.components}/ui`,
    utils: config.aliases.utils,
    lib: config.aliases.lib ?? "",
    hooks: config.aliases.hooks ?? "",
    composables: config.aliases.composables ?? "",
  }
}

/**
 * A component is installed when the ui directory holds the file `add` would
 * have written for it: `<name>.tsx` for React, a `<name>/` directory for Vue.
 * Matching against the registry index keeps a project's own components out of
 * the list.
 */
async function readInstalled(
  uiDir: string,
  names: ReadonlySet<string>
): Promise<string[]> {
  if (!existsSync(uiDir)) return []
  const entries = await readdir(uiDir, { withFileTypes: true })
  const installed = new Set<string>()
  for (const entry of entries) {
    const name = entry.isDirectory()
      ? entry.name
      : entry.name.replace(/\.(tsx|jsx|ts|js|vue)$/, "")
    if (names.has(name)) installed.add(name)
  }
  return [...installed].toSorted((a, b) => a.localeCompare(b))
}

export async function info(options: InfoOptions): Promise<void> {
  const cwd = resolveCwd(options.cwd)
  const config = await getConfig(cwd)

  if (config === null) {
    const message = `No components.json in ${cwd}. Run \`newtui init\` first.`
    if (options.json) {
      console.log(JSON.stringify({ error: message }, null, 2))
      process.exitCode = 1
      return
    }
    logger.error(message)
    process.exitCode = 1
    return
  }

  const framework = config.framework ?? DEFAULT_FRAMEWORK
  const registry = getRegistryUrl(
    framework,
    options.registry ?? config.registry
  )
  const tailwindMajor = await detectTailwindMajor(
    cwd,
    config.resolvedPaths.tailwindCss
  )

  // A registry that cannot be reached should not make `info` useless: the
  // project facts are local, and only the installed list needs the index.
  const index = await getRegistryIndex(registry).catch(() => null)
  const names = new Set(index?.map((item) => item.name) ?? [])
  const installed =
    index === null ? [] : await readInstalled(config.resolvedPaths.ui, names)

  const project: ProjectInfo = {
    framework,
    bundler: config.bundler,
    typescript: config.typescript,
    tailwind: {
      version: tailwindMajor,
      css: config.tailwind.css,
      config: config.tailwind.config,
    },
    aliases: readAliases(config),
    registry,
    installed,
    cli: "newtui",
  }

  if (options.json) {
    console.log(JSON.stringify(project, null, 2))
    return
  }

  intro(highlighter.bold(`newt/ui in ${cwd}`))
  logger.info(`framework      ${project.framework}`)
  if (project.bundler) logger.info(`bundler        ${project.bundler}`)
  logger.info(`typescript     ${project.typescript}`)
  logger.info(`tailwind       v${project.tailwind.version}`)
  logger.info(`stylesheet     ${project.tailwind.css}`)
  logger.info(`ui alias       ${project.aliases.ui}`)
  logger.info(`registry       ${project.registry}`)
  logger.info(
    `installed      ${
      project.installed.length === 0
        ? "none"
        : `${project.installed.length} — ${project.installed.join(", ")}`
    }`
  )
  outro(
    index === null
      ? "The registry could not be reached, so the installed list is empty."
      : `Add more with ${highlighter.info(`newtui add <name>`)}.`
  )
}

/** The same facts, for callers inside the process (the MCP server). */
export async function readProjectInfo(
  cwd: string,
  registryOverride?: string
): Promise<ProjectInfo | null> {
  const config = await getConfig(cwd).catch(() => null)
  if (config === null) return null

  const framework = config.framework ?? DEFAULT_FRAMEWORK
  const registry = getRegistryUrl(
    framework,
    registryOverride ?? config.registry
  )
  const index = await getRegistryIndex(registry).catch(() => null)
  const names = new Set(index?.map((item) => item.name) ?? [])

  return {
    framework,
    bundler: config.bundler,
    typescript: config.typescript,
    tailwind: {
      version: await detectTailwindMajor(cwd, config.resolvedPaths.tailwindCss),
      css: config.tailwind.css,
      config: config.tailwind.config,
    },
    aliases: readAliases(config),
    registry,
    installed:
      index === null ? [] : await readInstalled(config.resolvedPaths.ui, names),
    cli: "newtui",
  }
}

/** Where a project's ui directory is on disk, for tools that read files. */
export async function resolveUiDir(cwd: string): Promise<string | null> {
  const config = await getConfig(cwd).catch(() => null)
  return config === null ? null : path.resolve(config.resolvedPaths.ui)
}
