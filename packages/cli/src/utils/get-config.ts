import path from "node:path"

import { z } from "zod"

import { pathExists, readFileIfExists } from "./fileSystem.js"
import {
  BUNDLERS,
  type BundlerName,
  FRAMEWORKS,
  NUXT_CONFIG_CANDIDATES,
} from "./options.js"

const DEFAULT_STYLE = "default"
export const DEFAULT_COMPONENTS = "@/components"
export const DEFAULT_UTILS = "@/lib/utils"
export const DEFAULT_UI = "@/components/ui"
export const DEFAULT_LIB = "@/lib"
export const DEFAULT_HOOKS = "@/hooks"
export const DEFAULT_COMPOSABLES = "@/composables"
export const DEFAULT_TAILWIND_CONFIG = "tailwind.config.ts"
const DEFAULT_TAILWIND_BASE_COLOR = "neutral"
export const DEFAULT_FRAMEWORK = "react"
/** React Server Components are assumed on when `components.json` omits `rsc`. */
export const RSC_DEFAULT = true
export const DEFAULT_BUNDLER = "nuxt"

/** Where `init` writes the tokens when it finds no existing stylesheet. */
export const DEFAULT_TAILWIND_CSS = {
  react: "app/globals.css",
  nuxt: "app/assets/css/main.css",
  vite: "src/style.css",
} as const satisfies Record<"react" | BundlerName, string>

export const CONFIG_FILE_NAME = "components.json"

export const frameworkSchema = z.enum(FRAMEWORKS)
export type Framework = z.infer<typeof frameworkSchema>

export const bundlerSchema = z.enum(BUNDLERS)
export type Bundler = z.infer<typeof bundlerSchema>

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    style: z.string().default(DEFAULT_STYLE),
    framework: frameworkSchema.default(DEFAULT_FRAMEWORK),
    /** Vue only — which build tool the project uses. */
    bundler: bundlerSchema.optional(),
    typescript: z.boolean().default(true),
    /**
     * React only, and left optional so a Vue `components.json` does not grow a
     * field that means nothing there. Kept separate from `typescript` because
     * it controls whether `"use client"` survives, which TypeScript alone does
     * not imply. Absent means enabled — see `RSC_DEFAULT`.
     */
    rsc: z.boolean().optional(),
    /**
     * Legacy alias of `typescript` written by the React CLI before the two
     * CLIs merged. Read by `migrateRawConfig` and preserved so an existing
     * `components.json` keeps validating.
     */
    tsx: z.boolean().optional(),
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
      hooks: z.string().optional(),
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
    hooks: z.string(),
    composables: z.string(),
  }),
})

export type Config = z.infer<typeof configSchema>

/**
 * The wire shape of `components.json`: the fields above plus the ones the two
 * CLIs wrote before they merged. `framework` used to name the Vue build tool,
 * and the React CLI spelled "is this project TypeScript" as `tsx`.
 */
const componentsFileSchema = z
  .object({
    framework: z.enum([...FRAMEWORKS, ...BUNDLERS]).optional(),
    bundler: bundlerSchema.optional(),
    typescript: z.boolean().optional(),
    tsx: z.boolean().optional(),
    aliases: z
      .object({ composables: z.string().optional() })
      .passthrough()
      .optional(),
  })
  .passthrough()

type ComponentsFile = z.infer<typeof componentsFileSchema>

/**
 * Bring a `components.json` written by either of the old CLIs up to the merged
 * shape, so an existing project keeps working without being re-initialized.
 */
function migrateComponentsFile(file: ComponentsFile): ComponentsFile {
  const migrated = { ...file }

  // `framework: "nuxt" | "vite"` was the Vue CLI's build tool, not the target
  // framework — move it to `bundler` and mark the project as Vue.
  if (file.framework === "nuxt" || file.framework === "vite") {
    migrated.bundler = file.bundler ?? file.framework
    migrated.framework = "vue"
  } else if (file.framework === undefined) {
    // Neither CLI wrote a target framework; only the Vue one wrote
    // `typescript` and `aliases.composables`.
    migrated.framework =
      file.typescript !== undefined || file.aliases?.composables !== undefined
        ? "vue"
        : "react"
  }

  if (file.typescript === undefined && file.tsx !== undefined) {
    migrated.typescript = file.tsx
  }

  return migrated
}

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
      // SAFETY: this is a best-effort JSONC read of a hand-authored tsconfig/jsconfig;
      // the result is only ever consumed through optional chaining
      // (`compilerOptions?.baseUrl`, `compilerOptions?.paths`) below, so an unexpected
      // shape degrades to the defaults instead of throwing or corrupting resolved paths.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
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
 * Uses tsconfig `paths` when available, otherwise resolves under
 * `forcedBaseDir` when given, or falls back to `src/` (the layout used by the
 * newt/ui Vite template) if that exists, or the project root.
 */
async function resolveImport(
  alias: string,
  cwd: string,
  /**
   * Forces a base directory — `"app"` for a Nuxt 4 project, `"src"` for a
   * `src`-directory one — even when it does not exist on disk yet (e.g.
   * during `init` on an empty project). Without this, `init` would write
   * `lib/utils.ts` at the root while `add` later resolves the same alias
   * under the real base, disagreeing with itself.
   */
  forcedBaseDir?: string
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

  const stripped = alias.replace(/^[@~]\//, "")
  if (forcedBaseDir !== undefined) {
    return path.resolve(cwd, forcedBaseDir, stripped)
  }

  // Fallback: look in `src/` if present.
  const srcDir = path.resolve(cwd, "src")
  if (pathExists(srcDir)) {
    return path.resolve(srcDir, stripped)
  }
  return path.resolve(cwd, stripped)
}

/**
 * Nuxt 4 moves the source root to `app/`; Nuxt 3 (and a v4 project with a
 * custom `srcDir`) may use something else entirely. Checked in order of how
 * trustworthy the signal is: an explicit `srcDir` in the target's own
 * `nuxt.config`, what is already on disk, then what the installed (or
 * opted-in) Nuxt major implies for a project that has neither yet.
 */
async function detectNuxtBaseDir(cwd: string): Promise<string | undefined> {
  const hints = await readNuxtConfigHints(cwd)
  if (hints.srcDir !== undefined) return hints.srcDir

  if (pathExists(path.resolve(cwd, "app"))) return "app"
  if (pathExists(path.resolve(cwd, "src"))) return "src"

  if (hints.compatibilityVersion4) return "app"
  const major = await readNuxtMajor(cwd)
  return major !== undefined && major >= 4 ? "app" : undefined
}

async function readNuxtConfigHints(
  cwd: string
): Promise<{ srcDir?: string; compatibilityVersion4?: boolean }> {
  for (const candidate of NUXT_CONFIG_CANDIDATES) {
    const raw = await readFileIfExists(path.resolve(cwd, candidate))
    if (raw === null) continue
    const srcDirMatch = raw.match(/srcDir\s*:\s*["'`]([^"'`]+)["'`]/)
    return {
      srcDir: srcDirMatch?.[1]?.replace(/\/$/, ""),
      compatibilityVersion4: /compatibilityVersion\s*:\s*4\b/.test(raw),
    }
  }
  return {}
}

async function readNuxtMajor(cwd: string): Promise<number | undefined> {
  const raw = await readFileIfExists(path.resolve(cwd, "package.json"))
  if (raw === null) return undefined
  const match = raw.match(/"nuxt"\s*:\s*"[^"\d]*(\d+)/)
  return match ? Number(match[1]) : undefined
}

export async function resolveConfigPaths(
  cwd: string,
  config: RawConfig
): Promise<Config> {
  const forcedBaseDir =
    config.bundler === "nuxt"
      ? await detectNuxtBaseDir(cwd)
      : // A css path under `src/` means the project uses a src directory,
        // even when that directory has not been created yet.
        config.tailwind.css.startsWith("src/")
        ? "src"
        : undefined
  const utils = await resolveImport(config.aliases.utils, cwd, forcedBaseDir)
  const components = await resolveImport(
    config.aliases.components,
    cwd,
    forcedBaseDir
  )
  const ui = config.aliases.ui
    ? await resolveImport(config.aliases.ui, cwd, forcedBaseDir)
    : path.resolve(components, "ui")
  const lib = config.aliases.lib
    ? await resolveImport(config.aliases.lib, cwd, forcedBaseDir)
    : path.dirname(utils)
  const hooks = config.aliases.hooks
    ? await resolveImport(config.aliases.hooks, cwd, forcedBaseDir)
    : path.resolve(path.dirname(components), "hooks")
  const composables = config.aliases.composables
    ? await resolveImport(config.aliases.composables, cwd, forcedBaseDir)
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
      hooks,
      composables,
    },
  })
}

export async function getRawConfig(cwd: string): Promise<RawConfig | null> {
  const configPath = path.resolve(cwd, CONFIG_FILE_NAME)
  const raw = await readFileIfExists(configPath)
  if (raw === null) return null
  try {
    return rawConfigSchema.parse(
      migrateComponentsFile(componentsFileSchema.parse(JSON.parse(raw)))
    )
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
