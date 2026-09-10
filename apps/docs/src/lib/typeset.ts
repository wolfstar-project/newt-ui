import { z } from "zod"

/*
 * The state behind /typeset. Three numbers decide the rhythm — size, leading
 * and flow — and three fonts decide the voice; everything else the stylesheet
 * needs it already reads from the `--newt-*` tokens.
 *
 * The URL is the only persistence, as on /create: a typeset worth keeping is
 * one worth sending to somebody.
 */
export const TYPESET_PRESETS = ["docs", "chat", "article"] as const
export type TypesetPreset = (typeof TYPESET_PRESETS)[number]

export const FONT_CHOICES = [
  "sans",
  "display",
  "mono",
  "system",
  "serif",
] as const
export type FontChoice = (typeof FONT_CHOICES)[number]

/**
 * Each choice resolves to a token where the library has one. Nothing is
 * fetched: a font that is not on the reader's machine is a font the preview
 * would lie about.
 */
export const FONT_STACKS = {
  sans: {
    label: "Sans",
    stack: "var(--newt-font-sans)",
  },
  display: {
    label: "Display",
    stack: "var(--newt-font-display)",
  },
  mono: {
    label: "Mono",
    stack: "var(--newt-font-mono)",
  },
  system: {
    label: "System",
    stack: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  serif: {
    label: "Serif",
    stack: 'Georgia, "Iowan Old Style", "Times New Roman", serif',
  },
} as const satisfies Record<FontChoice, { label: string; stack: string }>

export const MEASURES = ["none", "55ch", "68ch", "80ch"] as const
export type Measure = (typeof MEASURES)[number]

/** The three numbers, with the range the sliders offer. */
export const RHYTHM_RANGES = {
  size: { min: 0.875, max: 1.25, step: 0.0625, unit: "em" },
  leading: { min: 1.25, max: 2, step: 0.05, unit: "" },
  flow: { min: 0.5, max: 2, step: 0.125, unit: "em" },
} as const

const rhythm = (key: keyof typeof RHYTHM_RANGES) =>
  z.coerce.number().min(RHYTHM_RANGES[key].min).max(RHYTHM_RANGES[key].max)

export const typesetSchema = z.object({
  preset: z.enum(TYPESET_PRESETS),
  body: z.enum(FONT_CHOICES),
  heading: z.enum(FONT_CHOICES),
  mono: z.enum(FONT_CHOICES),
  size: rhythm("size"),
  leading: rhythm("leading"),
  flow: rhythm("flow"),
  measure: z.enum(MEASURES),
})

export type TypesetParams = z.infer<typeof typesetSchema>

/** The three numbers each preset stands for, in the stylesheet's own values. */
export const PRESET_RHYTHM = {
  docs: { size: 1, leading: 1.75, flow: 1.25 },
  chat: { size: 0.9375, leading: 1.375, flow: 0.5 },
  article: { size: 1.0625, leading: 1.8, flow: 1.5 },
} as const satisfies Record<
  TypesetPreset,
  { size: number; leading: number; flow: number }
>

export const DEFAULT_TYPESET: TypesetParams = {
  preset: "docs",
  body: "sans",
  heading: "display",
  mono: "mono",
  ...PRESET_RHYTHM.docs,
  measure: "68ch",
}

/** Switching preset resets the three numbers; the fonts are a separate choice. */
export function withPreset(
  params: TypesetParams,
  preset: TypesetPreset
): TypesetParams {
  return { ...params, preset, ...PRESET_RHYTHM[preset] }
}

/** Whether the numbers still match the preset they came from. */
export function matchesPreset(params: TypesetParams): boolean {
  const base = PRESET_RHYTHM[params.preset]
  return (
    params.size === base.size &&
    params.leading === base.leading &&
    params.flow === base.flow
  )
}

/**
 * A link that no longer parses opens the builder at its defaults rather than
 * at an error: the reader wanted to look at type, not at a stack trace.
 */
export function parseTypeset(search: string): TypesetParams {
  const query = new URLSearchParams(search)
  const result = typesetSchema.safeParse({
    preset: query.get("preset") ?? DEFAULT_TYPESET.preset,
    body: query.get("body") ?? DEFAULT_TYPESET.body,
    heading: query.get("heading") ?? DEFAULT_TYPESET.heading,
    mono: query.get("mono") ?? DEFAULT_TYPESET.mono,
    size: query.get("size") ?? DEFAULT_TYPESET.size,
    leading: query.get("leading") ?? DEFAULT_TYPESET.leading,
    flow: query.get("flow") ?? DEFAULT_TYPESET.flow,
    measure: query.get("measure") ?? DEFAULT_TYPESET.measure,
  })
  return result.success ? result.data : DEFAULT_TYPESET
}

export function typesetSearch(params: TypesetParams): string {
  const query = new URLSearchParams({
    preset: params.preset,
    body: params.body,
    heading: params.heading,
    mono: params.mono,
    size: String(params.size),
    leading: String(params.leading),
    flow: String(params.flow),
    measure: params.measure,
  })
  return query.toString()
}

export interface TypesetVariable {
  readonly property: string
  readonly value: string
}

/** What the preview wrapper carries, and what the emitted block declares. */
export function typesetVariables(
  params: TypesetParams
): readonly TypesetVariable[] {
  return [
    { property: "--typeset-size", value: `${params.size}em` },
    { property: "--typeset-leading", value: String(params.leading) },
    { property: "--typeset-flow", value: `${params.flow}em` },
    { property: "--typeset-font-body", value: FONT_STACKS[params.body].stack },
    {
      property: "--typeset-font-heading",
      value: FONT_STACKS[params.heading].stack,
    },
    { property: "--typeset-font-mono", value: FONT_STACKS[params.mono].stack },
  ]
}

/**
 * The overrides as a class, not as a fourth preset: a project that wants its
 * own rhythm names it once and puts that name beside `typeset`.
 */
export function typesetCss(
  params: TypesetParams,
  name = "typeset-custom"
): string {
  const declarations = typesetVariables(params)
    .map((variable) => `  ${variable.property}: ${variable.value};`)
    .join("\n")
  return `.${name} {\n${declarations}\n}\n`
}

export type SnippetFlavour = "react" | "vue" | "html"

/** The wrapper, in whichever flavour the reader is reading. */
export function typesetSnippet(
  flavour: SnippetFlavour,
  params: TypesetParams,
  className = "typeset-custom"
): string {
  const measure = params.measure === "none" ? "" : " measure"
  const classes = `typeset typeset-${params.preset} ${className}${
    params.measure === "none" ? "" : " typeset-measure"
  }`

  if (flavour === "react") {
    return `<Typeset as="article" preset="${params.preset}"${measure} className="${className}">
  {/* whatever your markdown renderer emitted */}
</Typeset>`
  }
  if (flavour === "vue") {
    return `<Typeset as="article" preset="${params.preset}"${measure} class="${className}">
  <!-- whatever your markdown renderer emitted -->
</Typeset>`
  }
  return `<article class="${classes}">
  <!-- whatever your markdown renderer emitted -->
</article>`
}

/** Which controls a shuffle is allowed to touch. */
export interface TypesetLocks {
  readonly body: boolean
  readonly heading: boolean
  readonly mono: boolean
  readonly size: boolean
  readonly leading: boolean
  readonly flow: boolean
}

export const NO_LOCKS: TypesetLocks = {
  body: false,
  heading: false,
  mono: false,
  size: false,
  leading: false,
  flow: false,
}

function pick<T>(items: readonly T[], random: () => number): T {
  const item = items[Math.floor(random() * items.length)]
  if (item === undefined) throw new Error("Cannot pick from an empty list.")
  return item
}

function step(key: keyof typeof RHYTHM_RANGES, random: () => number): number {
  const { min, max, step: size } = RHYTHM_RANGES[key]
  const steps = Math.round((max - min) / size)
  const value = min + Math.floor(random() * (steps + 1)) * size
  /* The sliders move in fixed steps, so the value has to land on one. */
  return Number(value.toFixed(4))
}

/**
 * Shuffle rerolls everything that is not locked. It is how a reader finds a
 * combination they would not have typed, and the locks are how they keep the
 * half they already liked.
 */
export function shuffleTypeset(
  params: TypesetParams,
  locks: TypesetLocks,
  random: () => number = Math.random
): TypesetParams {
  return {
    ...params,
    body: locks.body ? params.body : pick(FONT_CHOICES, random),
    heading: locks.heading ? params.heading : pick(FONT_CHOICES, random),
    mono: locks.mono ? params.mono : pick(FONT_CHOICES, random),
    size: locks.size ? params.size : step("size", random),
    leading: locks.leading ? params.leading : step("leading", random),
    flow: locks.flow ? params.flow : step("flow", random),
  }
}
