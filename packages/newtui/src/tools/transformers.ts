import path from "node:path"

import { RSC_DEFAULT, type Config } from "./config.js"
import type {
  RegistryItem,
  RegistryItemFile,
  RegistryItemType,
} from "./schema.js"

export interface NormalizedFile {
  path: string
  content: string
  type: RegistryItemType
  target?: string
}

export function normalizeFile(
  file: RegistryItemFile,
  fallbackType: RegistryItemType
): NormalizedFile | null {
  // `RegistryItemFile` is `string | { path, content?, type?, target? }`; a bare
  // string entry carries no content to write, so skip it.
  if (!(file instanceof Object)) return null
  if (file.content === undefined) return null
  return {
    path: file.path,
    content: file.content,
    type: file.type ?? fallbackType,
    target: file.target,
  }
}

/**
 * Rewrite registry-internal import paths to the user's configured aliases.
 * The two registries root their components differently:
 *   React: `@/registry/default/ui/button`     -> `@/components/ui/button`
 *   Vue:   `@/lib/registry/default/ui/button` -> `@/components/ui/button`
 * `@/lib/utils` maps to `<aliases.utils>` in both.
 */
function transformImports(content: string, config: Config): string {
  const uiAlias = config.aliases.ui ?? `${config.aliases.components}/ui`
  const libAlias = config.aliases.lib ?? "@/lib"
  // React ships hooks, Vue ships composables; each registry only references its own.
  const hooksAlias =
    config.framework === "vue"
      ? (config.aliases.composables ?? "@/composables")
      : (config.aliases.hooks ?? "@/hooks")
  const hooksSegment = config.framework === "vue" ? "composables" : "hooks"
  const root = config.framework === "vue" ? "@/lib/registry" : "@/registry"
  const escapedRoot = root.replace(/[/\\]/g, "\\$&")

  let out = content
  out = out.replace(
    new RegExp(`${escapedRoot}/[^/"']+/ui/`, "g"),
    `${uiAlias}/`
  )
  out = out.replace(
    new RegExp(`${escapedRoot}/[^/"']+/${hooksSegment}/`, "g"),
    `${hooksAlias}/`
  )
  out = out.replace(
    new RegExp(`${escapedRoot}/[^/"']+/lib/`, "g"),
    `${libAlias}/`
  )
  out = out.replace(
    new RegExp(`${escapedRoot}/[^/"']+/`, "g"),
    `${config.aliases.components}/`
  )
  out = out.replace(/(["'])@\/lib\/utils\1/g, `$1${config.aliases.utils}$1`)
  return out
}

/**
 * Strip `"use client"` directives when a React project is not using React
 * Server Components.
 */
function transformRsc(content: string, config: Config): string {
  if (config.framework !== "react" || (config.rsc ?? RSC_DEFAULT))
    return content
  return content.replace(/^["']use client["'];?\s*\n/m, "")
}

/**
 * Drop `lang="ts"` from Vue SFC blocks when the project is not using
 * TypeScript. Type annotations are not stripped (a full TS transform is out of
 * scope).
 */
function transformTypeScript(content: string, config: Config): string {
  if (config.framework !== "vue" || config.typescript) return content
  return content.replace(/<script([^>]*)\slang="ts"/g, "<script$1")
}

/**
 * Convert `.tsx`/`.ts` sources to `.jsx`/`.js` file names when the project is
 * not using TypeScript. `.vue` single-file components keep their extension.
 */
function transformFileName(filePath: string, config: Config): string {
  if (config.typescript) return filePath
  return filePath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js")
}

export function transformContent(content: string, config: Config): string {
  return transformTypeScript(
    transformRsc(transformImports(content, config), config),
    config
  )
}

/**
 * Vue registry items are directories: `ui/button/Button.vue`, `ui/button/index.ts`.
 * Keep everything below the registry root segment (`ui/`, `lib/`, ...) so the
 * component directory structure is preserved inside the user's project. React
 * items are single files, so they flatten to their base name.
 */
function relativeToRoot(
  filePath: string,
  root: string,
  config: Config
): string {
  if (config.framework !== "vue") return path.basename(filePath)
  const normalized = filePath.replace(/^\.?\//, "")
  const prefix = `${root}/`
  const index = normalized.indexOf(prefix)
  const rest =
    index === -1 ? normalized : normalized.slice(index + prefix.length)
  return rest.length > 0 ? rest : path.basename(normalized)
}

/**
 * Resolve where a registry file should be written based on its type and the user's aliases.
 */
export function resolveTargetPath(
  file: NormalizedFile,
  item: RegistryItem,
  config: Config
): string {
  if (file.target) {
    return path.resolve(config.resolvedPaths.cwd, file.target)
  }
  const type = file.type ?? item.type
  switch (type) {
    case "registry:ui":
      return path.resolve(
        config.resolvedPaths.ui,
        transformFileName(relativeToRoot(file.path, "ui", config), config)
      )
    case "registry:lib":
      return path.resolve(
        config.resolvedPaths.lib,
        transformFileName(relativeToRoot(file.path, "lib", config), config)
      )
    case "registry:hook":
      return config.framework === "vue"
        ? path.resolve(
            config.resolvedPaths.composables,
            transformFileName(
              relativeToRoot(file.path, "composables", config),
              config
            )
          )
        : path.resolve(
            config.resolvedPaths.hooks,
            transformFileName(path.basename(file.path), config)
          )
    case "registry:block":
    case "registry:component":
    case "registry:example":
      return path.resolve(
        config.resolvedPaths.components,
        transformFileName(path.basename(file.path), config)
      )
    case "registry:page":
    case "registry:file":
      return path.resolve(
        config.resolvedPaths.cwd,
        transformFileName(file.path, config)
      )
    default:
      return path.resolve(
        config.resolvedPaths.components,
        transformFileName(path.basename(file.path), config)
      )
  }
}
