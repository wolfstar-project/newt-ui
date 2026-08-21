import path from "node:path"

import { z } from "zod"

import { pathExists, readFileIfExists } from "./fileSystem.js"
import { FRAMEWORKS } from "./options.js"

const DEFAULT_STYLE = "default"
export const DEFAULT_COMPONENTS = "@/components"
export const DEFAULT_UTILS = "@/lib/utils"
export const DEFAULT_UI = "@/components/ui"
export const DEFAULT_LIB = "@/lib"
export const DEFAULT_COMPOSABLES = "@/composables"
export const DEFAULT_TAILWIND_CSS = "src/assets/css/tailwind.css"
export const DEFAULT_TAILWIND_CONFIG = "tailwind.config.ts"
const DEFAULT_TAILWIND_BASE_COLOR = "neutral"
export const DEFAULT_FRAMEWORK = "nuxt"

export const CONFIG_FILE_NAME = "components.json"

export const frameworkSchema = z.enum(FRAMEWORKS)
export type Framework = z.infer<typeof frameworkSchema>

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    style: z.string().default(DEFAULT_STYLE),
    typescript: z.boolean().default(true),
    framework: frameworkSchema.default(DEFAULT_FRAMEWORK),
    tailwind: z.object({
      config: z.string().default(DEFAULT_TAILWIND_CONFIG),
      css: z.string(),
      baseColor: z.string().default(DEFAULT_TAILWIND_BASE_COLOR),
      cssVariables: z.boolean().default(true),
      prefix: z.string().default("").optional(),
    }),
    aliases: z.object({
      components: z.string().default(DEFAULT_COMPONENTS),
      utils: z.string().default(DEFAULT_UTILS),
      ui: z.string().optional(),
      lib: z.string().optional(),
      composables: z.string().optional(),
    }),
    iconLibrary: z.string().optional(),
    registry: z.string().optional(),
  })
  .strict()

export type RawConfig = z.infer<typeof rawConfigSchema>

const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    cwd: z.string(),
    tailwindConfig: z.string(),
    tailwindCss: z.string(),
    utils: z.string(),
    components: z.string(),
    ui: z.string(),
    lib: z.string(),
    composables: z.string(),
  }),
})

export type Config = z.infer<typeof configSchema>

interface TsConfigLike {
  compilerOptions?: {
    baseUrl?: string
    paths?: Record<string, string[]>
  }
}

async function readTsConfigPaths(
  cwd: string
): Promise<{ baseUrl: string; paths: Record<string, string[]> }> {
  const candidates = ["tsconfig.json", "jsconfig.json"]
  for (const candidate of candidates) {
    const filePath = path.resolve(cwd, candidate)
    const raw = await readFileIfExists(filePath)
    if (raw === null) continue
    try {
      // Strip comments and trailing commas (tsconfig allows JSONC).
      const cleaned = raw
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, "")
        .replace(/,(\s*[}\]])/g, "$1")
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- best-effort tsconfig read, no runtime schema needed here.
      const parsed = JSON.parse(cleaned) as TsConfigLike
      return {
        baseUrl: parsed.compilerOptions?.baseUrl ?? ".",
        paths: parsed.compilerOptions?.paths ?? {},
      }
    } catch {
      // fall through to defaults
    }
  }
  return { baseUrl: ".", paths: {} }
}

/**
 * Resolve an import alias such as `@/components/ui` to an absolute directory.
 * Uses tsconfig `paths` when available, otherwise falls back to `src/` (the
 * Nuxt `srcDir` convention used by the newt/ui templates) or the project root.
 */
async function resolveImport(
  alias: string,
  cwd: string,
  /**
   * Forces the `src/` base when the project uses a `src` directory but it does
   * not exist on disk yet (e.g. during `init` on an empty project). Without
   * this, `init` would write `lib/utils.ts` at the root while `add` later
   * resolves the same alias to `src/lib`.
   */
  preferSrcDir?: boolean
): Promise<string> {
  const { baseUrl, paths } = await readTsConfigPaths(cwd)
  const base = path.resolve(cwd, baseUrl)

  for (const [pattern, targets] of Object.entries(paths)) {
    const target = targets[0]
    if (!target) continue
    const prefix = pattern.replace(/\*$/, "")
    if (alias === prefix.replace(/\/$/, "") || alias.startsWith(prefix)) {
      const rest = alias.slice(prefix.length)
      const targetPrefix = target.replace(/\*$/, "")
      return path.resolve(base, targetPrefix + rest)
    }
  }

  // Fallback: strip a leading `@/` or `~/` and look in `src/` if present.
  const stripped = alias.replace(/^[@~]\//, "")
  const srcDir = path.resolve(cwd, "src")
  if (preferSrcDir || pathExists(srcDir)) {
    return path.resolve(srcDir, stripped)
  }
  return path.resolve(cwd, stripped)
}

export async function resolveConfigPaths(
  cwd: string,
  config: RawConfig
): Promise<Config> {
  // A css path under `src/` means the project uses a src directory, even when
  // that directory has not been created yet.
  const preferSrcDir = config.tailwind.css.startsWith("src/")
  const utils = await resolveImport(config.aliases.utils, cwd, preferSrcDir)
  const components = await resolveImport(
    config.aliases.components,
    cwd,
    preferSrcDir
  )
  const ui = config.aliases.ui
    ? await resolveImport(config.aliases.ui, cwd, preferSrcDir)
    : path.resolve(components, "ui")
  const lib = config.aliases.lib
    ? await resolveImport(config.aliases.lib, cwd, preferSrcDir)
    : path.dirname(utils)
  const composables = config.aliases.composables
    ? await resolveImport(config.aliases.composables, cwd, preferSrcDir)
    : path.resolve(path.dirname(components), "composables")

  return configSchema.parse({
    ...config,
    resolvedPaths: {
      cwd,
      tailwindConfig: path.resolve(cwd, config.tailwind.config),
      tailwindCss: path.resolve(cwd, config.tailwind.css),
      utils,
      components,
      ui,
      lib,
      composables,
    },
  })
}

export async function getRawConfig(cwd: string): Promise<RawConfig | null> {
  const configPath = path.resolve(cwd, CONFIG_FILE_NAME)
  const raw = await readFileIfExists(configPath)
  if (raw === null) return null
  try {
    return rawConfigSchema.parse(JSON.parse(raw))
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Invalid configuration found in ${configPath}.\n${detail}`,
      { cause: error }
    )
  }
}

export async function getConfig(cwd: string): Promise<Config | null> {
  const raw = await getRawConfig(cwd)
  if (!raw) return null
  return resolveConfigPaths(cwd, raw)
}
