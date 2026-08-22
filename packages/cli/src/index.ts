import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

import mri from "mri"

import { add } from "./commands/add.js"
import { diff } from "./commands/diff.js"
import { init } from "./commands/init.js"
import { list } from "./commands/list.js"
import { handleError, highlighter, logger } from "./tools/logger.js"
import {
  BOOLEAN_FLAGS,
  FLAG_ALIASES,
  flagBoolean,
  flagString,
  isCommandName,
  isFrameworkName,
  STRING_FLAGS,
  type Flags,
} from "./tools/options.js"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

interface PackageJson {
  name: string
  version: string
}

function getPackageInfo(): PackageJson {
  const require = createRequire(import.meta.url)
  const here = path.dirname(fileURLToPath(import.meta.url))
  for (const candidate of ["../package.json", "../../package.json"]) {
    try {
      // SAFETY: this always resolves to the CLI's own package.json (one of the two
      // relative candidates above), whose `name`/`version` fields we author and
      // control ourselves.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      return require(path.resolve(here, candidate)) as PackageJson
    } catch {
      // try next
    }
  }
  return { name: "newt-ui-vue", version: "0.0.0" }
}

function printHelp(): void {
  const { version } = getPackageInfo()
  console.log(`
  ${highlighter.bold("newt-ui-vue")} ${highlighter.dim(`v${version}`)}
  Add Discord-inspired newt/ui components to your Vue or Nuxt project.

  ${highlighter.bold("Usage")}
    $ newt-ui-vue <command> [options]

  ${highlighter.bold("Commands")}
    init                     initialize your project and install dependencies
    add [components...]      add components to your project
    list                     list available components in the registry
    diff <component>         check an installed component against the registry

  ${highlighter.bold("Options")}
    -c, --cwd <dir>          working directory (default: current directory)
    -r, --registry <url>     registry base url (overrides NEWT_REGISTRY_URL)
    -y, --yes                skip confirmation prompts
    -d, --defaults           use the default configuration (init)
    -f, --framework <name>   the framework to use: nuxt or vite (init)
        --css <path>         path to your global css file (init)
        --skip-install       skip installing dependencies (init, add)
    -o, --overwrite          overwrite existing files (add)
    -a, --all                add every available component (add)
    -p, --path <path>        the path to add the component to (add)
    -t, --type <type>        filter by registry item type (list)
        --json               output as JSON (list)
    -h, --help               display this message
    -v, --version            display the version number

  ${highlighter.bold("Examples")}
    $ newt-ui-vue init --defaults
    $ newt-ui-vue add button avatar
    $ newt-ui-vue list --type all
    $ newt-ui-vue diff button
`)
}

async function main(): Promise<void> {
  const args = mri<Flags>(process.argv.slice(2), {
    alias: { ...FLAG_ALIASES },
    boolean: [...BOOLEAN_FLAGS],
    string: [...STRING_FLAGS],
  })
  const [command, ...rest] = args._

  if (flagBoolean(args.version)) {
    console.log(getPackageInfo().version)
    return
  }
  if (!command || flagBoolean(args.help)) {
    printHelp()
    return
  }
  if (!isCommandName(command)) {
    logger.error(`Unknown command "${command}".`)
    printHelp()
    process.exit(1)
  }

  const cwd = flagString(args.cwd) ?? process.cwd()
  const registry = flagString(args.registry)
  const yes = flagBoolean(args.yes)
  const skipInstall = flagBoolean(args["skip-install"])

  switch (command) {
    case "init": {
      const framework = flagString(args.framework)
      if (framework !== undefined && !isFrameworkName(framework)) {
        throw new Error(
          `Unknown framework "${framework}". Expected "nuxt" or "vite".`
        )
      }
      await init({
        cwd,
        yes,
        defaults: flagBoolean(args.defaults),
        skipInstall,
        css: flagString(args.css),
        framework,
        registry,
      })
      break
    }
    case "add":
      await add({
        components: rest,
        cwd,
        registry,
        yes,
        overwrite: flagBoolean(args.overwrite),
        all: flagBoolean(args.all),
        path: flagString(args.path),
        skipInstall,
      })
      break
    case "list":
      await list({
        cwd,
        registry,
        type: flagString(args.type),
        json: flagBoolean(args.json),
      })
      break
    case "diff":
      await diff({ component: rest[0], cwd, registry })
      break
  }
}

main().catch(handleError)
