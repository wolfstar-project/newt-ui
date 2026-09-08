import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

export function pathExists(target: string): boolean {
  return existsSync(target)
}

/** Resolve a `--cwd` value, failing early when the directory is missing. */
export function resolveCwd(cwd: string): string {
  const resolved = path.resolve(cwd)
  if (!existsSync(resolved)) {
    throw new Error(`The path ${resolved} does not exist. Please try again.`)
  }
  return resolved
}

/** First candidate (relative to `cwd`) that exists on disk. */
export function findFirstExisting(
  cwd: string,
  candidates: readonly string[]
): string | undefined {
  return candidates.find((candidate) =>
    existsSync(path.resolve(cwd, candidate))
  )
}

export async function readFileIfExists(target: string): Promise<string | null> {
  if (!existsSync(target)) return null
  return readFile(target, "utf8")
}

export async function readTextFile(target: string): Promise<string> {
  return readFile(target, "utf8")
}

/** Write a file, creating any missing parent directories first. */
export async function writeFileAt(
  target: string,
  content: string
): Promise<void> {
  await mkdir(path.dirname(target), { recursive: true })
  await writeFile(target, content, "utf8")
}

export function relativePath(cwd: string, target: string): string {
  return path.relative(cwd, target)
}
