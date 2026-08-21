import { spawn } from "node:child_process"
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
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- reading our own package.json.
      return require(path.resolve(here, candidate)) as PackageJson
    } catch {
      // try next
    }
  }
  return { name: "newt-ui", version: "0.0.0" }
}

/**
 * `newt-ui --legacy <args>` delegates to the HTML/CSS CLI (cli/index.js),
 * which is also exposed as the `newt-ui-html` bin.
 */
function runLegacy(args: string[]): void {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const legacyCandidates = [
    path.resolve(here, "../cli/index.js"),
    path.resolve(here, "../../cli/index.js"),
  ]
  const legacy = legacyCandidates.find((candidate) => {
    try {
      createRequire(import.meta.url).resolve(candidate)
      return true
    } catch {
      return false
    }
  })
  if (!legacy) {
    console.error("Legacy HTML/CSS CLI (cli/index.js) not found in package.")
    process.exit(1)
  }
  const child = spawn(process.execPath, [legacy, ...args], { stdio: "inherit" })
  child.on("exit", (code) => process.exit(code ?? 0))
}

function printHelp(): void {
  const { version } = getPackageInfo()
  console.log(`
  ${highlighter.bold("newt-ui")} ${highlighter.dim(`v${version}`)}
  Add Discord-inspired newt/ui components to your React project.

  ${highlighter.bold("Usage")}
    $ newt-ui <command> [options]

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
        --css <path>         path to your global css file (init)
        --skip-install       skip installing dependencies (init, add)
    -o, --overwrite          overwrite existing files (add)
    -a, --all                add every available component (add)
    -p, --path <path>        the path to add the component to (add)
    -t, --type <type>        filter by registry item type (list)
        --json               output as JSON (list)
        --legacy             use the legacy HTML/CSS CLI (same as newt-ui-html)
    -h, --help               display this message
    -v, --version            display the version number

  ${highlighter.bold("Examples")}
    $ newt-ui init --defaults
    $ newt-ui add button avatar
    $ newt-ui list --type all
    $ newt-ui diff button
`)
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2)
  const legacyIndex = argv.indexOf("--legacy")
  if (legacyIndex !== -1) {
    runLegacy(argv.filter((_, index) => index !== legacyIndex))
    return
  }

  const args = mri<Flags>(argv, {
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
    case "init":
      await init({
        cwd,
        yes,
        defaults: flagBoolean(args.defaults),
        skipInstall,
        css: flagString(args.css),
        registry,
      })
      break
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
