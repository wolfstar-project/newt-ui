import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { intro, outro } from "@clack/prompts"

import { resolveCwd } from "../utils/fileSystem.js"
import { getConfig } from "../utils/get-config.js"
import { highlighter, logger } from "../utils/logger.js"
import { rewriteRtl } from "../utils/rtl.js"

export const MIGRATIONS = ["rtl"] as const
export type Migration = (typeof MIGRATIONS)[number]

export function isMigration(value: string): value is Migration {
  return MIGRATIONS.some((migration) => migration === value)
}

export interface MigrateOptions {
  migration: string
  cwd: string
  dryRun: boolean
}

const SOURCE = /\.(tsx|jsx|ts|js|vue)$/

/** Every source file under the ui directory, however deeply it nests. */
async function collect(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...(await collect(full)))
    else if (SOURCE.test(entry.name)) files.push(full)
  }
  return files
}

export async function migrate(options: MigrateOptions): Promise<void> {
  if (!isMigration(options.migration)) {
    logger.error(
      `Unknown migration "${options.migration}". Available: ${MIGRATIONS.join(", ")}.`
    )
    process.exitCode = 1
    return
  }

  const cwd = resolveCwd(options.cwd)
  const config = await getConfig(cwd)
  if (config === null) {
    logger.error(`No components.json in ${cwd}. Run \`newtui init\` first.`)
    process.exitCode = 1
    return
  }

  const uiDir = config.resolvedPaths.ui
  if (!existsSync(uiDir)) {
    logger.error(`No components at ${uiDir}. Nothing to migrate.`)
    process.exitCode = 1
    return
  }

  intro(
    highlighter.bold(
      options.dryRun ? "Migrate to RTL (dry run)" : "Migrate to RTL"
    )
  )

  let touched = 0
  for (const file of await collect(uiDir)) {
    const source = await readFile(file, "utf8")
    const { code, changes } = rewriteRtl(source)
    if (changes.length === 0) continue

    touched += 1
    logger.info(highlighter.info(path.relative(cwd, file)))
    // Repeats collapse: the same rewrite five times in a file is one line.
    for (const change of new Set(changes)) logger.info(`  ${change}`)
    if (!options.dryRun) await writeFile(file, code, "utf8")
  }

  outro(
    touched === 0
      ? "Nothing to change: these components already use logical properties."
      : options.dryRun
        ? `${touched} file${touched === 1 ? "" : "s"} would change. Run without --dry-run to apply.`
        : `${touched} file${touched === 1 ? "" : "s"} rewritten. Check them under \`dir="rtl"\` before committing.`
  )
}
