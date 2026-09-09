import { readFileIfExists, writeFileAt } from "../fileSystem.js"
import {
  PRESET_END_MARKER,
  PRESET_MARKER,
  presetToCss,
  type Preset,
} from "../preset.js"

export type PresetWrite = "added" | "replaced"

/** Everything between the two preset comments, including them. */
const PRESET_BLOCK =
  /\/\* newt\/ui preset[\s\S]*?\/\* end newt\/ui preset \*\/\n?/

export function withPreset(existing: string, preset: Preset): string {
  const block = presetToCss(preset)
  if (
    existing.includes(PRESET_MARKER) &&
    existing.includes(PRESET_END_MARKER)
  ) {
    return existing.replace(PRESET_BLOCK, block)
  }
  return `${existing.replace(/\s*$/, "\n")}\n${block}`
}

export function presetWriteKind(existing: string): PresetWrite {
  return existing.includes(PRESET_MARKER) &&
    existing.includes(PRESET_END_MARKER)
    ? "replaced"
    : "added"
}

/**
 * Write the preset overrides into the global stylesheet, after the token
 * block. A stylesheet that already carries a preset has that one swapped out
 * rather than a second one appended: two blocks would both apply, and the
 * winner would be whichever came last rather than whichever was chosen.
 */
export async function updatePresetCss(
  cssPath: string,
  preset: Preset
): Promise<PresetWrite> {
  const existing = (await readFileIfExists(cssPath)) ?? ""
  const kind = presetWriteKind(existing)
  await writeFileAt(cssPath, withPreset(existing, preset))
  return kind
}
