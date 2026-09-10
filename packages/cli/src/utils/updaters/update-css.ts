import type { RegistryItem } from "../../schema/index.js"
import { readFileIfExists, relativePath, writeFileAt } from "../fileSystem.js"
import type { Config } from "../get-config.js"
import { logger } from "../logger.js"
import { detectTailwindMajor, renderItemCss } from "../tailwind.js"

/** Append registry styles using the consumer's Tailwind major. */
export async function updateCss(
  items: RegistryItem[],
  config: Config
): Promise<void> {
  const styled = items.filter((item) => item.cssVars ?? item.css)
  if (styled.length === 0) return

  const cssPath = config.resolvedPaths.tailwindCss
  const existing = (await readFileIfExists(cssPath)) ?? ""
  const major = await detectTailwindMajor(config.resolvedPaths.cwd, cssPath)

  const additions: string[] = []
  for (const item of styled) {
    const rendered = renderItemCss(item, major)
    if (rendered.length === 0) continue
    if (existing.includes(rendered.trim())) continue
    additions.push(`/* newt/ui — ${item.name} */\n${rendered}`)
  }
  if (additions.length === 0) return

  await writeFileAt(
    cssPath,
    `${existing.replace(/\s*$/, "\n")}\n${additions.join("\n")}`
  )
  logger.success(
    `+ ${relativePath(config.resolvedPaths.cwd, cssPath)} (styles)`
  )
}
