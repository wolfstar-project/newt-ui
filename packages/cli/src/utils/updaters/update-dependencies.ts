import type { RegistryItem } from "../../schema/index.js"
import type { Config } from "../get-config.js"
import { logger } from "../logger.js"
import { installDependencies } from "../packageManager.js"

export async function updateDependencies(
  items: RegistryItem[],
  config: Config,
  options: { skipInstall: boolean }
): Promise<void> {
  const dependencies = new Set<string>()
  const devDependencies = new Set<string>()
  for (const item of items) {
    for (const dep of item.dependencies ?? []) dependencies.add(dep)
    for (const dep of item.devDependencies ?? []) devDependencies.add(dep)
  }

  if (!options.skipInstall) {
    if (dependencies.size > 0) {
      logger.info(
        `Installing dependencies: ${Array.from(dependencies).join(", ")}`
      )
      await installDependencies(
        config.resolvedPaths.cwd,
        Array.from(dependencies)
      )
    }
    if (devDependencies.size > 0) {
      logger.info(
        `Installing devDependencies: ${Array.from(devDependencies).join(", ")}`
      )
      await installDependencies(
        config.resolvedPaths.cwd,
        Array.from(devDependencies),
        { dev: true }
      )
    }
  } else if (dependencies.size > 0 || devDependencies.size > 0) {
    logger.warn(
      `Skipped install. Dependencies: ${[...dependencies, ...devDependencies].join(", ")}`
    )
  }
}
