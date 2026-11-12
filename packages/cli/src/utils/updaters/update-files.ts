import path from "node:path"

import type { RegistryItem } from "../../schema/index.js"
import { pathExists, relativePath, writeFileAt } from "../fileSystem.js"
import type { Config } from "../get-config.js"
import { highlighter } from "../logger.js"
import { promptConfirm } from "../prompts.js"
import {
  normalizeFile,
  resolveTargetPath,
  transformContent,
} from "../transformers/imports.js"

export async function updateFiles(
  items: RegistryItem[],
  config: Config,
  options: { yes: boolean; overwrite: boolean; path?: string }
): Promise<{ written: string[]; skipped: string[] }> {
  const written: string[] = []
  const skipped: string[] = []

  for (const item of items) {
    for (const rawFile of item.files ?? []) {
      const file = normalizeFile(rawFile, item.type)
      if (!file) continue

      /*
       * A registry names its own paths, and a third-party one is not ours to
       * vouch for: nothing it serves may climb out of the directory it was
       * given. `--path` and the aliases are the reader's own and stay free to
       * point anywhere.
       */
      for (const served of [file.path, file.target]) {
        if (served === undefined) continue
        if (path.isAbsolute(served) || served.split(/[/\\]/).includes("..")) {
          throw new Error(
            `Refusing to write "${served}" from "${item.name}": a registry path may not be absolute or contain "..".`
          )
        }
      }

      // Preserve Vue component directories when installing to a custom path.
      // Explicit registry targets take precedence over the command's --path.
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

  return { written, skipped }
}
