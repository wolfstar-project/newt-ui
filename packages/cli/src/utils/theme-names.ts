import { z } from "zod"

import type { RegistryItem } from "../schema/index.js"
import { renderItemCss, type TailwindMajor } from "./tailwind.js"

/*
 * A component styled with `shadow-elevation-high` produces no CSS when the
 * project's theme lacks `--shadow-elevation-high`, and Tailwind says nothing
 * about it. These functions find the theme names a component's sources reach,
 * compare them with what a project declares, and render what is missing in
 * the shape the project's Tailwind major reads. All of them are pure: the
 * caller reads the files and decides what to print or write.
 */

/** One `@theme` entry of the newt/ui theme, and its Tailwind v3 form. */
export interface ThemeEntry {
  /** The v4 custom property, for example `--color-newt-brand`. */
  readonly property: string
  /** Its value, which references the raw variable: `var(--newt-brand)`. */
  readonly value: string
  /** Where the entry sits in v3 `theme.extend`, when v3 has it. */
  readonly v3:
    | { readonly path: readonly string[]; readonly value: string }
    | undefined
  /** Matches a source that uses the entry, through a utility or `var()`. */
  readonly pattern: RegExp
}

/** Everything the theme item defines, read once. */
export interface ThemeCatalogue {
  readonly entries: readonly ThemeEntry[]
  /** Raw `--newt-*` variables and their dark values, in theme order. */
  readonly dark: Readonly<Record<string, string>>
  /** The light values, for the variables that have one. */
  readonly light: Readonly<Record<string, string>>
}

/** A set of theme names: `@theme` entries and raw `--newt-*` variables. */
export interface ThemeNames {
  readonly entries: readonly ThemeEntry[]
  /** Full custom property names, for example `--newt-brand`. */
  readonly variables: readonly string[]
}

/** What a project holds: its stylesheet text and, on v3, its config text. */
export interface ProjectTheme {
  readonly major: TailwindMajor
  /** The stylesheet and every stylesheet it imports, joined. */
  readonly css: string
  /** The `tailwind.config` source; `null` when the project has none. */
  readonly config: string | null
}

/**
 * Each Tailwind v4 theme namespace the theme item uses, the v3 `theme.extend`
 * key that holds the same values, and the utility that reads them. A theme
 * entry in another namespace is still found through `var()` references.
 */
const NAMESPACES = [
  {
    prefix: "--color-",
    v3: "colors",
    /* `bg-`, `text-`, `border-x-`, `ring-offset-`, ... all read a colour */
    utility: (name: string) => `(?:[a-z0-9]+-)+${name}`,
  },
  {
    prefix: "--transition-duration-",
    v3: "transitionDuration",
    utility: (name: string) => `duration-${name}`,
  },
  {
    prefix: "--font-",
    v3: "fontFamily",
    utility: (name: string) => `font-${name}`,
  },
  {
    prefix: "--shadow-",
    v3: "boxShadow",
    utility: (name: string) => `shadow-${name}`,
  },
  {
    prefix: "--ease-",
    v3: "transitionTimingFunction",
    utility: (name: string) => `ease-${name}`,
  },
  {
    prefix: "--radius-",
    v3: "borderRadius",
    utility: (name: string) =>
      `rounded(?:-(?:s|e|t|r|b|l|ss|se|es|ee|tl|tr|br|bl))?-${name}`,
  },
] as const

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/** `newt-brand` and `--newt-brand` both name the same custom property. */
function customProperty(key: string): string {
  return key.startsWith("--") ? key : `--${key}`
}

/** A name as a whole word: not the start of a longer class or property. */
function word(source: string): RegExp {
  return new RegExp(`(?<![\\w-])${source}(?![\\w-])`)
}

/** A `--name` reference, which is preceded by `(` or `,` rather than a word. */
function reference(property: string): RegExp {
  return new RegExp(`${escapeRegExp(property)}(?![\\w-])`)
}

/**
 * A v3 `theme.extend` value: a string at a leaf, an object of them above it.
 * Parsed once from the registry payload, whose schema leaves it open.
 */
type ConfigNode =
  | { readonly _tag: "Leaf"; readonly value: string }
  | {
      readonly _tag: "Branch"
      readonly children: Readonly<Record<string, ConfigNode>>
    }

const configNodeSchema: z.ZodType<ConfigNode, z.ZodTypeDef, unknown> = z.lazy(
  () =>
    z.union([
      z.string().transform((value) => ({ _tag: "Leaf" as const, value })),
      z
        .record(z.string(), configNodeSchema)
        .transform((children) => ({ _tag: "Branch" as const, children })),
    ])
)

/** `theme.extend`; a shape this file cannot read counts as no v3 forms. */
const extendSchema = z.record(z.string(), configNodeSchema).catch({})

/** Where a v3 value sits and what it is. */
interface V3Leaf {
  readonly path: readonly string[]
  readonly value: string
}

/**
 * The leaves of a v3 `theme.extend` bucket, keyed the way Tailwind names the
 * utility: `{ newt: { brand: … } }` is `newt-brand`.
 */
function flattenV3(
  node: ConfigNode | undefined,
  path: readonly string[] = []
): Map<string, V3Leaf> {
  const leaves = new Map<string, V3Leaf>()
  if (node === undefined) return leaves
  if (node._tag === "Leaf") {
    const name = path.filter((segment) => segment !== "DEFAULT").join("-")
    leaves.set(name, { path, value: node.value })
    return leaves
  }
  for (const [key, child] of Object.entries(node.children)) {
    for (const [name, leaf] of flattenV3(child, [...path, key])) {
      leaves.set(name, leaf)
    }
  }
  return leaves
}

/** The raw variables keyed by their full custom property name. */
function normalise(
  vars: Readonly<Record<string, string>> | undefined
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(vars ?? {}).map(([key, value]) => [
      customProperty(key),
      value,
    ])
  )
}

/** Read the theme item into the names it defines and how to find them. */
export function themeCatalogue(
  theme: Pick<RegistryItem, "cssVars" | "tailwind">
): ThemeCatalogue {
  const extend = extendSchema.parse(theme.tailwind?.config?.theme?.extend ?? {})

  const entries = Object.entries(theme.cssVars?.theme ?? {}).map(
    ([key, value]): ThemeEntry => {
      const property = customProperty(key)
      const namespace = NAMESPACES.find((candidate) =>
        property.startsWith(candidate.prefix)
      )
      if (namespace === undefined) {
        return { property, value, v3: undefined, pattern: reference(property) }
      }
      const name = property.slice(namespace.prefix.length)
      const leaf = flattenV3(extend[namespace.v3]).get(name)
      const utility = word(namespace.utility(escapeRegExp(name))).source
      return {
        property,
        value,
        v3:
          leaf === undefined
            ? undefined
            : { path: [namespace.v3, ...leaf.path], value: leaf.value },
        pattern: new RegExp(`${utility}|${reference(property).source}`),
      }
    }
  )

  return {
    entries,
    dark: normalise(theme.cssVars?.dark),
    light: normalise(theme.cssVars?.light),
  }
}

/** The raw variables an entry's value reads: `var(--newt-brand)`. */
function variablesOf(entry: ThemeEntry): string[] {
  return [...entry.value.matchAll(/--[\w-]+/g)].map((match) => match[0])
}

/** Keep `names` in catalogue order, so output is stable run to run. */
function inThemeOrder(
  catalogue: ThemeCatalogue,
  variables: ReadonlySet<string>
): string[] {
  return Object.keys(catalogue.dark).filter((name) => variables.has(name))
}

/** Every name the theme defines. */
export function allThemeNames(catalogue: ThemeCatalogue): ThemeNames {
  return {
    entries: catalogue.entries,
    variables: Object.keys(catalogue.dark),
  }
}

/**
 * The theme names `sources` reach: every entry whose utility or property
 * they mention, and every raw variable they or those entries read.
 */
export function themeNamesUsed(
  catalogue: ThemeCatalogue,
  sources: readonly string[]
): ThemeNames {
  const entries = catalogue.entries.filter((entry) =>
    sources.some((source) => entry.pattern.test(source))
  )
  const variables = new Set(entries.flatMap(variablesOf))
  for (const name of Object.keys(catalogue.dark)) {
    if (sources.some((source) => reference(name).test(source))) {
      variables.add(name)
    }
  }
  return { entries, variables: inThemeOrder(catalogue, variables) }
}

/** CSS text with its comments removed, so a commented-out line is absent. */
function withoutComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "")
}

function declares(css: string, property: string): boolean {
  return new RegExp(`(?<![\\w-])${escapeRegExp(property)}\\s*:`).test(css)
}

/**
 * The names in `names` that the project does not declare. Raw variables are
 * read from the stylesheet. On v4 the entries are too: they belong in its
 * `@theme`. On v3 they belong in `tailwind.config`, whose entries reference
 * the raw variable, so the reference is what is looked for.
 */
export function missingThemeNames(
  names: ThemeNames,
  project: ProjectTheme
): ThemeNames {
  const css = withoutComments(project.css)
  const config = project.config
  const entries = names.entries.filter((entry) => {
    if (project.major === 4) return !declares(css, entry.property)
    if (entry.v3 === undefined) return false
    return config === null || !config.includes(entry.v3.value)
  })
  return {
    entries,
    variables: names.variables.filter((name) => !declares(css, name)),
  }
}

/** Every name in a set, entries first, for a one-line summary. */
export function themeNameList(names: ThemeNames): string[] {
  return [...names.entries.map((entry) => entry.property), ...names.variables]
}

function pick(
  values: Readonly<Record<string, string>>,
  names: readonly string[]
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([name]) => names.includes(name))
  )
}

/** What a v3 config entry prints as: strings, and objects of them. */
type ConfigJson = string | ConfigObject

/** One level of a printed v3 `theme.extend`, keyed by Tailwind's names. */
interface ConfigObject {
  [key: string]: ConfigJson
}

/** Nest leaves under their paths: `boxShadow.x` becomes `{ boxShadow: { x } }`. */
function nest(leaves: readonly V3Leaf[]): ConfigObject {
  const out: ConfigObject = {}
  const groups = new Map<string, V3Leaf[]>()
  for (const leaf of leaves) {
    const [head, ...rest] = leaf.path
    if (head === undefined) continue
    if (rest.length === 0) {
      out[head] = leaf.value
      continue
    }
    groups.set(head, [
      ...(groups.get(head) ?? []),
      { path: rest, value: leaf.value },
    ])
  }
  for (const [head, children] of groups) out[head] = nest(children)
  return out
}

/** The block to add: stylesheet text, and on v3 the config entries. */
export interface RenderedThemeNames {
  readonly css: string
  /** The v3 `theme.extend` entries as JSON; `undefined` on v4 or when none. */
  readonly config: string | undefined
}

/**
 * The block to add, for the project's major. `css` goes into the stylesheet:
 * on v4 an `@theme` block and the variables, on v3 the variables only.
 * `config` is the v3 `theme.extend` object with the missing entries, which
 * the CLI prints because it does not edit a JavaScript config.
 */
export function renderThemeNames(
  names: ThemeNames,
  catalogue: ThemeCatalogue,
  major: TailwindMajor,
  darkSelector?: string
): RenderedThemeNames {
  const cssVars: NonNullable<RegistryItem["cssVars"]> = {}
  if (major === 4 && names.entries.length > 0) {
    cssVars.theme = Object.fromEntries(
      names.entries.map((entry) => [entry.property, entry.value])
    )
  }
  const dark = pick(catalogue.dark, names.variables)
  if (Object.keys(dark).length > 0) cssVars.dark = dark
  const light = pick(catalogue.light, names.variables)
  if (Object.keys(light).length > 0) cssVars.light = light

  const css = renderItemCss({ cssVars }, major, darkSelector)
  if (major === 4) return { css, config: undefined }

  const leaves = names.entries.flatMap((entry) =>
    entry.v3 === undefined ? [] : [entry.v3]
  )
  return {
    css,
    config:
      leaves.length > 0 ? JSON.stringify(nest(leaves), null, 2) : undefined,
  }
}

/** The stylesheet with `css` appended under one marker comment. */
export function appendThemeNames(existing: string, css: string): string {
  if (css.trim().length === 0) return existing
  return `${existing.replace(/\s*$/, "\n")}\n/* newt/ui — theme names */\n${css}`
}
