/**
 * Static option tables for the `newt-ui` CLI.
 *
 * Everything here is declared `as const` so the derived union types stay in
 * sync with the values the argv parser and the commands actually accept.
 */

export const COMMANDS = ["init", "add", "list", "diff"] as const
export type CommandName = (typeof COMMANDS)[number]

export const PACKAGE_MANAGERS = ["npm", "yarn", "pnpm", "bun"] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

export const BOOLEAN_FLAGS = [
  "all",
  "defaults",
  "help",
  "json",
  "legacy",
  "overwrite",
  "skip-install",
  "version",
  "yes",
] as const
export type BooleanFlag = (typeof BOOLEAN_FLAGS)[number]

export const STRING_FLAGS = ["css", "cwd", "path", "registry", "type"] as const
export type StringFlag = (typeof STRING_FLAGS)[number]

export const FLAG_ALIASES = {
  a: "all",
  c: "cwd",
  d: "defaults",
  h: "help",
  o: "overwrite",
  p: "path",
  r: "registry",
  t: "type",
  v: "version",
  y: "yes",
} as const

/** The shape `mri` produces for our flag set (values are unvalidated). */
export type Flags = Partial<Record<BooleanFlag | StringFlag, string | boolean>>

/** npm packages `init` installs into the user's project. */
export const PROJECT_DEPENDENCIES = [
  "clsx",
  "tailwind-merge",
  "class-variance-authority",
  "tailwindcss-animate",
] as const

/** Global stylesheets `init` looks for, in order of preference. */
export const CSS_CANDIDATES = [
  "app/globals.css",
  "src/app/globals.css",
  "styles/globals.css",
  "src/styles/globals.css",
  "src/index.css",
  "src/app.css",
] as const

/** Tailwind config files `init` looks for, in order of preference. */
export const TAILWIND_CONFIG_CANDIDATES = [
  "tailwind.config.ts",
  "tailwind.config.js",
  "tailwind.config.mjs",
  "tailwind.config.cjs",
] as const

export function isCommandName(value: string | undefined): value is CommandName {
  return COMMANDS.some((command) => command === value)
}

/** Read a flag that expects a value, ignoring `--flag` used without one. */
export function flagString(
  value: string | boolean | undefined
): string | undefined {
  if (value === undefined || value === true || value === false) return undefined
  return value.length > 0 ? value : undefined
}

/** Read a boolean flag, tolerating `--flag=true` style input. */
export function flagBoolean(value: string | boolean | undefined): boolean {
  return value === true || value === "true"
}
