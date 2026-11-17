/*
 * The command a docs page shows, spelled out for every package manager and,
 * for `newtui add`, for the shadcn CLIs too. Pure data: `PmTabs.astro` renders
 * every variant and CSS shows the one the reader picked.
 */

export const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const
export type PackageManager = (typeof PACKAGE_MANAGERS)[number]

export const CLIS = ["newtui", "shadcn"] as const
export type Cli = (typeof CLIS)[number]

/** A package to run once, or packages to add to the project. */
export type Command =
  | { readonly _tag: "run"; readonly cmd: string }
  | { readonly _tag: "install"; readonly packages: string }

export interface CommandVariant {
  readonly pm: PackageManager
  readonly cli: Cli
  /** `any` shows on both sides of the framework switch. */
  readonly framework: "any" | "react" | "vue"
  readonly text: string
}

const RUNNER = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx",
} satisfies Record<PackageManager, string>

const INSTALLER = {
  pnpm: "pnpm add",
  npm: "npm install",
  yarn: "yarn add",
  bun: "bun add",
} satisfies Record<PackageManager, string>

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
      text: `${INSTALLER[pm]} ${command.packages}`,
    }))
  }
  const items = shadcnItems(command.cmd)
  return PACKAGE_MANAGERS.flatMap((pm): CommandVariant[] => {
    const own: CommandVariant = {
      pm,
      cli: "newtui",
      framework: "any",
      text: `${RUNNER[pm]} ${command.cmd}`,
    }
    if (items === undefined) return [own]
    return [
      own,
      {
        pm,
        cli: "shadcn",
        framework: "react",
        text: `${RUNNER[pm]} shadcn@latest add ${items}`,
      },
      {
        pm,
        cli: "shadcn",
        framework: "vue",
        text: `${RUNNER[pm]} shadcn-vue@latest add ${items}`,
      },
    ]
  })
}
