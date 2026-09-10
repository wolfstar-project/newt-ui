import { resolveCommand } from "package-manager-detector/commands"

import { detectPackageManager, runCommand } from "./packageManager.js"
import type { PresetTemplate } from "./preset.js"

/*
 * `init --template <name>` does not ship a copy of each framework's starter:
 * it runs the creator that framework maintains, in the directory you are in,
 * and then carries on with the normal `init` flow inside the result. A vendored
 * template would be a second thing to keep current, and it would be wrong the
 * week after each framework's next release.
 */
interface Creator {
  /** The package the framework's own creator ships as. */
  readonly package: string
  readonly args: readonly string[]
  /** What `init` should assume it is looking at afterwards. */
  readonly framework: "react" | "vue"
  readonly bundler?: "vite" | "nuxt"
}

const CREATORS = {
  next: {
    package: "create-next-app@latest",
    args: [".", "--typescript", "--tailwind", "--app", "--yes"],
    framework: "react",
    bundler: undefined,
  },
  "vite-react": {
    package: "create-vite@latest",
    args: [".", "--template", "react-ts"],
    framework: "react",
    bundler: "vite",
  },
  "vite-vue": {
    package: "create-vite@latest",
    args: [".", "--template", "vue-ts"],
    framework: "vue",
    bundler: "vite",
  },
  nuxt: {
    package: "create-nuxt@latest",
    args: ["."],
    framework: "vue",
    bundler: "nuxt",
  },
} satisfies Record<PresetTemplate, Creator>

/** What the created project will look like to the rest of `init`. */
export interface TemplateDefaults {
  readonly framework: "react" | "vue"
  readonly bundler?: "vite" | "nuxt"
}

export function templateDefaults(template: PresetTemplate): TemplateDefaults {
  const creator = CREATORS[template]
  return { framework: creator.framework, bundler: creator.bundler }
}

/**
 * Run the framework's creator in `cwd`. Its output is inherited rather than
 * captured: these tools ask questions, and swallowing their prompts would make
 * the command look hung.
 */
export async function scaffoldTemplate(
  template: PresetTemplate,
  cwd: string
): Promise<void> {
  const creator = CREATORS[template]
  const packageManager = await detectPackageManager(cwd)
  const command = resolveCommand(packageManager, "execute", [
    creator.package,
    ...creator.args,
  ])
  if (!command) {
    throw new Error(
      `Could not resolve a way to run ${creator.package} with ${packageManager}.`
    )
  }
  await runCommand(command.command, command.args, cwd)
}
