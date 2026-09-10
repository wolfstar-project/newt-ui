import { resolveCwd } from "../utils/fileSystem.js"
import { getConfig, type Config } from "../utils/get-config.js"
import { highlighter } from "../utils/logger.js"

/** Resolve and validate the project before fetching or writing registry items. */
export async function preflightAdd(options: { cwd: string }): Promise<Config> {
  const cwd = resolveCwd(options.cwd)
  const config = await getConfig(cwd)
  if (!config) {
    throw new Error(
      `Configuration is missing. Please run ${highlighter.info("npx newtui init")} to create a components.json file.`
    )
  }
  return config
}
