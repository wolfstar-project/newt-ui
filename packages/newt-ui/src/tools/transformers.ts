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
 * e.g. `@/registry/default/ui/button` -> `@/components/ui/button`
 *      `@/lib/utils` -> `<aliases.utils>`
 */
function transformImports(content: string, config: Config): string {
  const uiAlias = config.aliases.ui ?? `${config.aliases.components}/ui`
  const hooksAlias = config.aliases.hooks ?? "@/hooks"
  const libAlias = config.aliases.lib ?? "@/lib"

  let out = content
  out = out.replace(/@\/registry\/[^/"']+\/ui\//g, `${uiAlias}/`)
  out = out.replace(/@\/registry\/[^/"']+\/hooks\//g, `${hooksAlias}/`)
  out = out.replace(/@\/registry\/[^/"']+\/lib\//g, `${libAlias}/`)
  out = out.replace(/@\/registry\/[^/"']+\//g, `${config.aliases.components}/`)
  out = out.replace(/(["'])@\/lib\/utils\1/g, `$1${config.aliases.utils}$1`)
  return out
}

/**
 * Strip `"use client"` directives when the project is not using React Server Components.
 */
function transformRsc(content: string, config: Config): string {
  if (config.rsc) return content
  return content.replace(/^["']use client["'];?\s*\n/m, "")
}

/**
 * Convert `.tsx`/`.ts` sources to `.jsx`/`.js` file names when `tsx: false`.
 * Type annotations are not stripped (a full TS transform is out of scope); we only rename.
 */
function transformFileName(filePath: string, config: Config): string {
  if (config.tsx) return filePath
  return filePath.replace(/\.tsx$/, ".jsx").replace(/\.ts$/, ".js")
}

export function transformContent(content: string, config: Config): string {
  return transformRsc(transformImports(content, config), config)
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
  const fileName = transformFileName(path.basename(file.path), config)
  const type = file.type ?? item.type
  switch (type) {
    case "registry:ui":
      return path.resolve(config.resolvedPaths.ui, fileName)
    case "registry:lib":
      return path.resolve(config.resolvedPaths.lib, fileName)
    case "registry:hook":
      return path.resolve(config.resolvedPaths.hooks, fileName)
    case "registry:block":
    case "registry:component":
    case "registry:example":
      return path.resolve(config.resolvedPaths.components, fileName)
    case "registry:page":
    case "registry:file":
      return path.resolve(config.resolvedPaths.cwd, file.path)
    default:
      return path.resolve(config.resolvedPaths.components, fileName)
  }
}
