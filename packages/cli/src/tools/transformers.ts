import path from "node:path"

import type { Config } from "./config.js"
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
  if (typeof file === "string") return null
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
 * e.g. `@/lib/registry/default/ui/button` -> `@/components/ui/button`
 *      `@/lib/utils` -> `<aliases.utils>`
 */
function transformImports(content: string, config: Config): string {
  const uiAlias = config.aliases.ui ?? `${config.aliases.components}/ui`
  const composablesAlias = config.aliases.composables ?? "@/composables"
  const libAlias = config.aliases.lib ?? "@/lib"

  let out = content
  out = out.replace(/@\/lib\/registry\/[^/"']+\/ui\//g, `${uiAlias}/`)
  out = out.replace(
    /@\/lib\/registry\/[^/"']+\/composables\//g,
    `${composablesAlias}/`
  )
  out = out.replace(/@\/lib\/registry\/[^/"']+\/lib\//g, `${libAlias}/`)
  out = out.replace(
    /@\/lib\/registry\/[^/"']+\//g,
    `${config.aliases.components}/`
  )
  out = out.replace(/(["'])@\/lib\/utils\1/g, `$1${config.aliases.utils}$1`)
  return out
}

/**
 * Drop `lang="ts"` from SFC blocks when the project is not using TypeScript.
 * Type annotations are not stripped (a full TS transform is out of scope).
 */
function transformTypeScript(content: string, config: Config): string {
  if (config.typescript) return content
  return content.replace(/<script([^>]*)\slang="ts"/g, "<script$1")
}

/**
 * Convert `.ts` sources to `.js` file names when `typescript: false`.
 * `.vue` single-file components keep their extension.
 */
function transformFileName(filePath: string, config: Config): string {
  if (config.typescript) return filePath
  return filePath.replace(/\.ts$/, ".js")
}

export function transformContent(content: string, config: Config): string {
  return transformTypeScript(transformImports(content, config), config)
}

/**
 * Vue registry items are directories: `ui/button/Button.vue`, `ui/button/index.ts`.
 * Keep everything below the registry root segment (`ui/`, `lib/`, ...) so the
 * component directory structure is preserved inside the user's project.
 */
function relativeToRoot(filePath: string, root: string): string {
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
        transformFileName(relativeToRoot(file.path, "ui"), config)
      )
    case "registry:lib":
      return path.resolve(
        config.resolvedPaths.lib,
        transformFileName(relativeToRoot(file.path, "lib"), config)
      )
    case "registry:hook":
      return path.resolve(
        config.resolvedPaths.composables,
        transformFileName(relativeToRoot(file.path, "composables"), config)
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
