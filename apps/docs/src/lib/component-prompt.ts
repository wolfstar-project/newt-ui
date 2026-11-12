/*
 * The prompt a component page hands to the reader's AI assistant: everything
 * `newtui add` would have done, written out so an agent can do it without the
 * CLI — the npm packages, every file of the component and of the registry
 * items it builds on, already placed at the paths the CLI would choose and
 * with its imports already rewritten to the default aliases.
 *
 * Pure on purpose: the page resolves the sources (through Vite's `?raw`
 * globs, which only exist at build time) and this module only arranges them,
 * so the tests can feed it plain strings.
 */

export type Framework = "react" | "vue"

/** One file the prompt asks the assistant to create. */
export interface PromptFile {
  /** Where the CLI would write it, relative to the project's source root. */
  readonly path: string
  readonly source: string
}

/** One registry item in the prompt: the component itself or a dependency. */
export interface PromptItem {
  readonly name: string
  readonly title: string
  readonly files: readonly PromptFile[]
}

export interface ComponentPromptInput {
  readonly framework: Framework
  /** The component the page documents; its files come last. */
  readonly item: PromptItem & { readonly description: string }
  /** The registry items it builds on, every level of them, in install order. */
  readonly dependencies: readonly PromptItem[]
  /** npm packages, across the component and everything it builds on. */
  readonly packages: readonly string[]
  /** The documentation site's origin, e.g. `https://newtui.dev`. */
  readonly siteUrl: string
  readonly siteName: string
  readonly utilsAlias: string
}

/*
 * The registry sources import one another through the registry's own roots;
 * the CLI rewrites them to the project's aliases on the way in. The prompt
 * does the same with the defaults `init` writes, so the files paste as they
 * are into a project that kept them.
 */
const REGISTRY_ROOTS = {
  react: ["@/registry/bases/newt", "@/registry/default"],
  vue: ["~~/registry/bases/newt", "@/lib/registry/default"],
} as const satisfies Record<Framework, readonly string[]>

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")
}

/** `@/registry/bases/newt/ui/button` → `@/components/ui/button`, and so on. */
export function rewriteRegistryImports(
  source: string,
  framework: Framework
): string {
  const hooks = framework === "vue" ? "composables" : "hooks"
  let out = source
  for (const root of REGISTRY_ROOTS[framework]) {
    const prefix = escapeRegExp(root)
    out = out
      .replace(new RegExp(`${prefix}/ui/`, "g"), "@/components/ui/")
      .replace(new RegExp(`${prefix}/${hooks}/`, "g"), `@/${hooks}/`)
      .replace(new RegExp(`${prefix}/lib/`, "g"), "@/lib/")
      .replace(
        new RegExp(`${prefix}/(?:blocks|examples)/`, "g"),
        "@/components/"
      )
  }
  return out
}

/**
 * Walks `registryDependencies` depth first, so every item comes after the
 * ones it imports. The item itself is not part of the result; an item reached
 * twice is listed once.
 */
export function registryClosure<T>(
  name: string,
  dependenciesOf: (name: string) => readonly string[] | undefined,
  resolve: (name: string) => T | undefined
): T[] {
  const seen = new Set<string>([name])
  const ordered: T[] = []
  const visit = (current: string) => {
    for (const dependency of dependenciesOf(current) ?? []) {
      if (seen.has(dependency)) continue
      seen.add(dependency)
      visit(dependency)
      const resolved = resolve(dependency)
      if (resolved !== undefined) ordered.push(resolved)
    }
  }
  visit(name)
  return ordered
}

function fenceFor(source: string): string {
  /* A source that itself holds a fence gets a longer one around it. */
  const longest = Math.max(
    2,
    ...[...source.matchAll(/`{3,}/g)].map((match) => match[0].length)
  )
  return "`".repeat(longest + 1)
}

function langFor(path: string): string {
  if (path.endsWith(".vue")) return "vue"
  if (path.endsWith(".tsx")) return "tsx"
  return "ts"
}

function fileBlock(file: PromptFile, framework: Framework): string {
  const source = rewriteRegistryImports(file.source, framework).trimEnd()
  const fence = fenceFor(source)
  return `${fence}${langFor(file.path)} title="${file.path}"\n${source}\n${fence}`
}

export function buildComponentPrompt(input: ComponentPromptInput): string {
  const { framework, item, dependencies, packages, siteUrl, siteName } = input
  const frameworkName = framework === "react" ? "React" : "Vue"
  const docs = (path: string) => new URL(path, siteUrl).href

  const steps: string[] = []

  steps.push(
    `Check that the project is already set up for ${siteName}: Tailwind CSS, the \`cn\` helper exported from \`${input.utilsAlias}\`, and the \`--newt-*\` design tokens mapped onto Tailwind. If any of the three is missing, set it up first by following ${docs("/docs/installation/manual.md")} — do not run the \`newtui\` CLI.`
  )

  if (packages.length > 0) {
    steps.push(
      `Install the npm dependencies with the project's package manager: ${packages
        .map((name) => `\`${name}\``)
        .join(", ")}. Skip any that are already in \`package.json\`.`
    )
  }

  steps.push(
    "Create every file below at the path in its title, relative to the project's source root (where `components/` and `lib/` live). If a file already exists, keep the existing one rather than overwriting it — it is the same component, possibly customised."
  )

  steps.push(
    "The imports use the default aliases (`@/components/ui`, `@/components`, `@/lib/utils`). If `components.json` or the tsconfig `paths` point somewhere else, rewrite them to match. Change nothing else in the files."
  )

  steps.push(
    `Style only with the existing \`--newt-*\` tokens and the Tailwind utilities mapped onto them; never hardcode a colour, radius or shadow. Then show me how to import and render \`${item.title}\`, as documented at ${docs(`/docs/components/${item.name}.md`)}.`
  )

  const sections = [
    ...dependencies.map((dependency) => ({
      heading: `${dependency.title} (\`${dependency.name}\`, required by ${item.title})`,
      files: dependency.files,
    })),
    { heading: `${item.title} (\`${item.name}\`)`, files: item.files },
  ]

  const lines = [
    `Add the ${siteName} ${item.title} component to this ${frameworkName} project by hand, without the newtui CLI.`,
    "",
    item.description,
    "",
    "## Steps",
    "",
    ...steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "## Files",
  ]
  for (const section of sections) {
    lines.push("", `### ${section.heading}`)
    for (const file of section.files) {
      lines.push("", fileBlock(file, framework))
    }
  }
  lines.push("")
  return lines.join("\n")
}
