/*
 * The command a docs page shows, spelled out for every package manager and,
 * for `newtui add`, for the shadcn CLIs too. Pure data: `PmTabs.astro` renders
 * every variant and CSS shows the one the reader picked.
 *
 * The list and the spellings follow npmx.dev, npm first: it is the default
 * for a reader who has not picked one.
 */

export const PACKAGE_MANAGERS = [
  "npm",
  "pnpm",
  "yarn",
  "bun",
  "deno",
  "vlt",
  "vp",
  "nub",
  "ni",
  "upm",
] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

export const DEFAULT_PACKAGE_MANAGER: PackageManager = "npm"

export const CLIS = ["newtui", "shadcn"] as const
export type Cli = (typeof CLIS)[number]

export type Framework = "react" | "vue"

/**
 * A package to run once, or packages to add to the project. `only` names the
 * one framework whose registry publishes the items, as for `nuxt-ui-theme`.
 */
export type Command =
  | { readonly _tag: "run"; readonly cmd: string; readonly only?: Framework }
  | { readonly _tag: "install"; readonly packages: string }

export interface CommandVariant {
  readonly pm: PackageManager
  readonly cli: Cli
  /** `any` shows on both sides of the framework switch. */
  readonly framework: "any" | Framework
  readonly text: string
}

interface Spelling {
  /** Downloads a package and runs its binary once. */
  readonly run: string
  /** Adds packages to the project; empty when the bare command does it. */
  readonly install: string
  /** Deno resolves npm packages through the `npm:` specifier. */
  readonly npmPrefix: boolean
}

const SPELLINGS = {
  npm: { run: "npx", install: "npm install", npmPrefix: false },
  pnpm: { run: "pnpm dlx", install: "pnpm add", npmPrefix: false },
  yarn: { run: "yarn dlx", install: "yarn add", npmPrefix: false },
  bun: { run: "bunx", install: "bun add", npmPrefix: false },
  /* `-A`: the CLI reads the project and writes files. */
  deno: { run: "deno run -A", install: "deno add", npmPrefix: true },
  vlt: { run: "vlx", install: "vlt install", npmPrefix: false },
  vp: { run: "vp dlx", install: "vp add", npmPrefix: false },
  nub: { run: "nubx", install: "nub add", npmPrefix: false },
  ni: { run: "nlx", install: "ni", npmPrefix: false },
  upm: { run: "upx", install: "upm add", npmPrefix: false },
} as const satisfies Record<PackageManager, Spelling>

function specifier(pm: PackageManager, name: string): string {
  return SPELLINGS[pm].npmPrefix ? `npm:${name}` : name
}

/** `pkg args...` run once: the first word is the package. */
function runText(pm: PackageManager, cmd: string): string {
  const [pkg, ...args] = cmd.split(" ")
  return [SPELLINGS[pm].run, specifier(pm, pkg), ...args].join(" ")
}

function installText(pm: PackageManager, packages: string): string {
  const names = packages.split(/\s+/).map((name) => specifier(pm, name))
  return [SPELLINGS[pm].install, ...names].join(" ")
}

const SHADCN_PACKAGES = {
  react: "shadcn",
  vue: "shadcn-vue",
} as const satisfies Record<Framework, string>

/** The namespace the registry publishes its own items under. */
const NAMESPACE = "@newtui"

/**
 * `newtui@latest add a b` as `@newtui/a @newtui/b`, the form the shadcn CLIs
 * resolve through the `registries` entry in `components.json`. A flag or
 * another registry's item has no shadcn equivalent we can promise.
 */
function shadcnItems(cmd: string): string | undefined {
  const match = /^newtui@latest add (.+)$/.exec(cmd)
  if (match === null) return undefined
  const names = match[1].split(/\s+/)
  if (!names.every((name) => /^[a-z0-9][a-z0-9-]*$/.test(name))) {
    return undefined
  }
  return names.map((name) => `${NAMESPACE}/${name}`).join(" ")
}

export function commandVariants(command: Command): readonly CommandVariant[] {
  if (command._tag === "install") {
    return PACKAGE_MANAGERS.map((pm) => ({
      pm,
      cli: "newtui",
      framework: "any",
      text: installText(pm, command.packages),
    }))
  }
  const items = shadcnItems(command.cmd)
  return PACKAGE_MANAGERS.flatMap((pm): CommandVariant[] => {
    const own: CommandVariant = {
      pm,
      cli: "newtui",
      framework: "any",
      text: runText(pm, command.cmd),
    }
    if (items === undefined) return [own]
    const shadcn = (framework: Framework): string =>
      runText(pm, `${SHADCN_PACKAGES[framework]}@latest add ${items}`)
    /* One registry has the items: its CLI shows whichever framework is on. */
    if (command.only !== undefined) {
      return [
        own,
        { pm, cli: "shadcn", framework: "any", text: shadcn(command.only) },
      ]
    }
    return [
      own,
      { pm, cli: "shadcn", framework: "react", text: shadcn("react") },
      { pm, cli: "shadcn", framework: "vue", text: shadcn("vue") },
    ]
  })
}
