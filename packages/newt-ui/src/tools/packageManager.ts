import spawn from "cross-spawn"
import { resolveCommand } from "package-manager-detector/commands"
import { detect } from "package-manager-detector/detect"

import { PACKAGE_MANAGERS, type PackageManager } from "./options.js"

const DEFAULT_PACKAGE_MANAGER: PackageManager = "npm"

function toPackageManager(name: string | undefined): PackageManager {
  return (
    PACKAGE_MANAGERS.find((candidate) => candidate === name) ??
    DEFAULT_PACKAGE_MANAGER
  )
}

/** Detect the package manager used by the project at `cwd` (lockfile first). */
export async function detectPackageManager(
  cwd: string
): Promise<PackageManager> {
  const detected = await detect({ cwd })
  return toPackageManager(detected?.name)
}

function run(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd, stdio: "inherit" })
    child.on("error", reject)
    child.on("close", (code) => {
      if (code === 0) {
        resolve()
        return
      }
      reject(
        new Error(
          `\`${command} ${args.join(" ")}\` failed with exit code ${code ?? 1}.`
        )
      )
    })
  })
}

export async function installDependencies(
  cwd: string,
  dependencies: string[],
  options: { dev?: boolean } = {}
): Promise<void> {
  if (dependencies.length === 0) return
  const packageManager = await detectPackageManager(cwd)
  const args = options.dev ? [...dependencies, "-D"] : dependencies
  const command = resolveCommand(packageManager, "add", args)
  if (!command) {
    throw new Error(
      `Could not resolve an install command for ${packageManager}.`
    )
  }
  await run(command.command, command.args, cwd)
}
