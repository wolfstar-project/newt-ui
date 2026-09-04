/**
 * Static option tables for the `newtui` CLI.
 *
 * Everything here is declared `as const` so the derived union types stay in
 * sync with the values the argv parser and the commands actually accept.
 */

export const COMMANDS = ["init", "add", "list", "diff"] as const
export type CommandName = (typeof COMMANDS)[number]

export const PACKAGE_MANAGERS = ["npm", "yarn", "pnpm", "bun"] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

/** The UI framework a project targets, and the key registry items carry. */
export const FRAMEWORKS = ["react", "vue"] as const
export type FrameworkName = (typeof FRAMEWORKS)[number]

/**
 * The build tool a Vue project uses. Only Vue projects need this — it decides
 * which stylesheet `init` looks for and which setup instructions it prints.
 * Earlier releases of the Vue CLI stored these values under `framework`;
 * `config.ts` migrates such a `components.json` on read.
 */
export const BUNDLERS = ["nuxt", "vite"] as const
export type BundlerName = (typeof BUNDLERS)[number]

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

export const STRING_FLAGS = [
  "bundler",
  "css",
  "cwd",
  "framework",
  "path",
  "registry",
  "type",
] as const
export type StringFlag = (typeof STRING_FLAGS)[number]

export const FLAG_ALIASES = {
  a: "all",
  b: "bundler",
  c: "cwd",
  d: "defaults",
  f: "framework",
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

/*
 * npm packages `init` installs into the user's project, chosen by the Tailwind
 * major it detected. `cn` is one compiled implementation of what `clsx` and
 * `tailwind-merge` do together, but its conflict tables are built for Tailwind
 * v4 only, so a v3 project keeps the pair that understands v3 class names.
 */
const SHARED_DEPENDENCIES = [
  "class-variance-authority",
  "tailwindcss-animate",
] as const

export const PROJECT_DEPENDENCIES_V3 = [
  "clsx",
  "tailwind-merge",
  ...SHARED_DEPENDENCIES,
] as const

export const PROJECT_DEPENDENCIES_V4 = ["cn", ...SHARED_DEPENDENCIES] as const

/** Nuxt config files `init` looks for when detecting a Vue project's bundler. */
export const NUXT_CONFIG_CANDIDATES = [
  "nuxt.config.ts",
  "nuxt.config.js",
  "nuxt.config.mjs",
] as const

/** Vite config files `init` looks for when detecting a Vue project's bundler. */
export const VITE_CONFIG_CANDIDATES = [
  "vite.config.ts",
  "vite.config.js",
  "vite.config.mjs",
] as const

/** Next.js config files `init` looks for when detecting a React project. */
export const NEXT_CONFIG_CANDIDATES = [
  "next.config.ts",
  "next.config.js",
  "next.config.mjs",
] as const

/** Global stylesheets `init` looks for, per framework (Vue splits by bundler). */
export const CSS_CANDIDATES = {
  react: [
    "app/globals.css",
    "src/app/globals.css",
    "styles/globals.css",
    "src/styles/globals.css",
    "src/index.css",
    "src/app.css",
  ],
  nuxt: [
    "src/assets/css/tailwind.css",
    "assets/css/tailwind.css",
    "src/assets/css/main.css",
    "assets/css/main.css",
  ],
  vite: [
    "src/assets/index.css",
    "src/assets/main.css",
    "src/style.css",
    "src/index.css",
  ],
} as const satisfies Record<"react" | BundlerName, readonly string[]>

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

export function isFrameworkName(
  value: string | undefined
): value is FrameworkName {
  return FRAMEWORKS.some((framework) => framework === value)
}

export function isBundlerName(value: string | undefined): value is BundlerName {
  return BUNDLERS.some((bundler) => bundler === value)
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
