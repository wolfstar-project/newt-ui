import { intro, outro } from "@clack/prompts"

import {
  readFileIfExists,
  relativePath,
  resolveCwd,
} from "../utils/fileSystem.js"
import { getConfig } from "../utils/get-config.js"
import { highlighter, logger } from "../utils/logger.js"
import { decodePreset, presetToCss } from "../utils/preset.js"
import {
  presetWriteKind,
  updatePresetCss,
} from "../utils/updaters/update-preset.js"

export interface ApplyOptions {
  cwd: string
  /** A `nt1.…` code from newt/create. */
  preset?: string
  dryRun: boolean
}

/**
 * The second half of `init --preset`, on its own: a project that is already
 * set up gets a new brand hue, radius scale, font stack, mode or direction
 * without anything else being rewritten.
 */
export async function apply(options: ApplyOptions): Promise<void> {
  if (!options.preset) {
    throw new Error(
      `Please pass a preset code, e.g. ${highlighter.info("newtui apply --preset nt1.…")}.`
    )
  }

  const preset = decodePreset(options.preset)
  const cwd = resolveCwd(options.cwd)

  if (options.dryRun) {
    console.log(presetToCss(preset))
    return
  }

  const config = await getConfig(cwd)
  if (!config) {
    throw new Error(
      `Configuration is missing. Please run ${highlighter.info("npx newtui init")} first.`
    )
  }

  intro(highlighter.bold("newt/ui — apply"))

  const cssPath = config.resolvedPaths.tailwindCss
  const existing = (await readFileIfExists(cssPath)) ?? ""
  if (!existing.includes("--newt-")) {
    logger.warn(
      `${relativePath(cwd, cssPath)} does not carry the newt tokens yet — the preset overrides them, so run \`init\` first.`
    )
  }

  const kind = presetWriteKind(existing)
  await updatePresetCss(cssPath, preset)

  outro(
    `${kind === "replaced" ? "Replaced" : "Added"} the preset block in ${highlighter.info(relativePath(cwd, cssPath))}.`
  )
}
