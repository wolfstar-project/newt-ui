import { z } from "zod"

/**
 * A preset is the handful of choices `newt/create` offers, packed into a code
 * short enough to paste into a terminal. It is not a theme file: everything it
 * carries is an override of a token that already exists, so a project that
 * never uses one looks exactly like a project whose preset is the defaults.
 *
 * The code is `nt1.<base64url of the JSON>`. The version lives in the prefix
 * *and* in the payload, so a future axis can be added without a link shared
 * today decoding into something it did not mean.
 */
export const PRESET_VERSION = 1
export const PRESET_PREFIX = `nt${PRESET_VERSION}.`

/** Every target the installation picker offers, in the same order. */
export const PRESET_FRAMEWORKS = [
  "next",
  "vite-react",
  "vite-vue",
  "nuxt",
  "astro",
  "tanstack-start",
  "react-router",
  "laravel",
  "manual",
  "html",
] as const
export type PresetFramework = (typeof PRESET_FRAMEWORKS)[number]

/**
 * The four `init --template` can scaffold from nothing. The other frameworks
 * are created by their own tool, and `init` runs inside the result — a preset
 * still records which one you were aiming at, it just does not imply a
 * template.
 */
export const PRESET_TEMPLATES = [
  "next",
  "vite-react",
  "vite-vue",
  "nuxt",
] as const
export type PresetTemplate = (typeof PRESET_TEMPLATES)[number]

export const PRESET_RADII = ["none", "sm", "md", "lg", "xl"] as const
export const PRESET_FONTS = [
  "inter",
  "system",
  "serif",
  "rounded",
  "mono-first",
] as const
/** A heading font of its own, or `same` to follow the body. */
export const PRESET_HEADINGS = ["same", ...PRESET_FONTS] as const
/** The grey the surfaces are mixed from. */
export const PRESET_NEUTRALS = ["slate", "neutral", "stone", "ink"] as const
export const PRESET_SHADOWS = ["soft", "flat", "deep"] as const
export const PRESET_MODES = ["dark", "light"] as const
export const PRESET_DIRECTIONS = ["ltr", "rtl"] as const

export type PresetRadius = (typeof PRESET_RADII)[number]
export type PresetFont = (typeof PRESET_FONTS)[number]
export type PresetHeading = (typeof PRESET_HEADINGS)[number]
export type PresetNeutral = (typeof PRESET_NEUTRALS)[number]
export type PresetShadow = (typeof PRESET_SHADOWS)[number]
export type PresetMode = (typeof PRESET_MODES)[number]
export type PresetDirection = (typeof PRESET_DIRECTIONS)[number]

/*
 * Keys are one letter because they are spent in a URL and in a command line.
 * The schema is the only place that knows what they stand for.
 */
export const presetSchema = z.object({
  /** version */
  v: z.literal(PRESET_VERSION),
  /** target framework */
  t: z.enum(PRESET_FRAMEWORKS),
  /** brand hue */
  b: z.string().regex(/^#[0-9a-f]{6}$/i, "expected a #rrggbb colour"),
  /** radius scale */
  r: z.enum(PRESET_RADII),
  /** font stack */
  f: z.enum(PRESET_FONTS),
  /** default surface mode */
  m: z.enum(PRESET_MODES),
  /** writing direction */
  d: z.enum(PRESET_DIRECTIONS),
  /*
   * The three below arrived after the first codes were shared. Each has a
   * default and is left out of a code when it is the default, so every code
   * minted before them still decodes, and still encodes to itself.
   */
  /** neutral the surfaces are mixed from */
  n: z.enum(PRESET_NEUTRALS).default("slate"),
  /** heading font */
  h: z.enum(PRESET_HEADINGS).default("same"),
  /** elevation shadows */
  s: z.enum(PRESET_SHADOWS).default("soft"),
})

export type Preset = z.infer<typeof presetSchema>

/** A preset as a code carries it: the later axes are there only when chosen. */
type PresetPayload = z.input<typeof presetSchema>

export const DEFAULT_PRESET: Preset = {
  v: PRESET_VERSION,
  t: "next",
  b: "#5865f2",
  r: "md",
  f: "inter",
  m: "dark",
  d: "ltr",
  n: "slate",
  h: "same",
  s: "soft",
}

/** Thrown for every malformed code, so callers can report one clean line. */
export class PresetError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PresetError"
  }
}

export function isPresetTemplate(value: string): value is PresetTemplate {
  return PRESET_TEMPLATES.some((template) => template === value)
}

/** The template `init` can scaffold for this preset, if there is one. */
export function templateFor(preset: Preset): PresetTemplate | undefined {
  return isPresetTemplate(preset.t) ? preset.t : undefined
}

function toBase64Url(json: string): string {
  return Buffer.from(json, "utf8")
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "")
}

function fromBase64Url(code: string): string {
  const base64 = code.replaceAll("-", "+").replaceAll("_", "/")
  return Buffer.from(base64, "base64").toString("utf8")
}

/**
 * The key order is fixed so the same choices always produce the same code —
 * two readers who pick the same options get one shareable link, not two.
 */
export function encodePreset(preset: Preset): string {
  const parsed = presetSchema.parse(preset)
  const ordered: PresetPayload = {
    v: parsed.v,
    t: parsed.t,
    b: parsed.b.toLowerCase(),
    r: parsed.r,
    f: parsed.f,
    m: parsed.m,
    d: parsed.d,
  }
  /* A later axis is written only when it was chosen; see the schema. */
  if (parsed.n !== DEFAULT_PRESET.n) ordered.n = parsed.n
  if (parsed.h !== DEFAULT_PRESET.h) ordered.h = parsed.h
  if (parsed.s !== DEFAULT_PRESET.s) ordered.s = parsed.s
  return `${PRESET_PREFIX}${toBase64Url(JSON.stringify(ordered))}`
}

export function decodePreset(code: string): Preset {
  const trimmed = code.trim()
  if (!trimmed.startsWith(PRESET_PREFIX)) {
    throw new PresetError(
      `"${trimmed}" is not a preset code — they start with "${PRESET_PREFIX}".`
    )
  }

  let json: string
  try {
    json = fromBase64Url(trimmed.slice(PRESET_PREFIX.length))
  } catch {
    throw new PresetError("That preset code is not valid base64url.")
  }

  let payload: unknown
  try {
    payload = JSON.parse(json)
  } catch {
    throw new PresetError("That preset code does not carry valid JSON.")
  }

  const result = presetSchema.safeParse(payload)
  if (!result.success) {
    const [issue] = result.error.issues
    const where = issue?.path.join(".")
    throw new PresetError(
      `That preset code is not valid: ${issue?.message ?? "unknown field"}${
        where ? ` (${where})` : ""
      }.`
    )
  }
  return result.data
}

/**
 * The hover and active steps are the base darkened. A picker that offers one
 * colour still has to produce the three the components read.
 */
function darken(hex: string, amount: number): string {
  const value = Number.parseInt(hex.slice(1), 16)
  const channels = [value >> 16, (value >> 8) & 0xff, value & 0xff]
  return `#${channels
    .map((channel) =>
      Math.round(channel * (1 - amount))
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`
}

const RADIUS_SCALES = {
  none: { sm: "0px", md: "0px", lg: "0px" },
  sm: { sm: "2px", md: "4px", lg: "6px" },
  md: { sm: "4px", md: "8px", lg: "12px" },
  lg: { sm: "6px", md: "12px", lg: "18px" },
  xl: { sm: "8px", md: "16px", lg: "24px" },
} as const satisfies Record<PresetRadius, Record<"sm" | "md" | "lg", string>>

/* Only `inter` names a webfont; the rest are stacks every system resolves. */
const FONT_STACKS = {
  inter: {
    sans: '"Inter", "gg sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: '"Inter", sans-serif',
  },
  system: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  serif: {
    sans: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
    display: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
  },
  rounded: {
    sans: 'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", Quicksand, Nunito, system-ui, sans-serif',
    display:
      'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", Quicksand, Nunito, system-ui, sans-serif',
  },
  "mono-first": {
    sans: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
    display: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  },
} as const satisfies Record<PresetFont, { sans: string; display: string }>

/** The surface tokens a neutral restates, in the order the block lists them. */
const SURFACE_TOKENS = [
  "bg-base",
  "bg-surface",
  "bg-elevated",
  "bg-floating",
  "bg-input",
  "bg-input-elevated",
  "border",
] as const

type Surfaces = Record<(typeof SURFACE_TOKENS)[number], string>

/*
 * A neutral is the grey the surfaces are mixed from, for both surface sets.
 * `slate` is the one `tokens.css` ships, so it has no entry: choosing it
 * writes nothing.
 */
const NEUTRAL_SURFACES = {
  neutral: {
    dark: {
      "bg-base": "#1c1c1c",
      "bg-surface": "#262626",
      "bg-elevated": "#2e2e2e",
      "bg-floating": "#1c1c1c",
      "bg-input": "#1c1c1c",
      "bg-input-elevated": "#383838",
      border: "#404040",
    },
    light: {
      "bg-base": "#e5e5e5",
      "bg-surface": "#f5f5f5",
      "bg-elevated": "#ffffff",
      "bg-floating": "#ffffff",
      "bg-input": "#ededed",
      "bg-input-elevated": "#ffffff",
      border: "#d4d4d4",
    },
  },
  stone: {
    dark: {
      "bg-base": "#201e1c",
      "bg-surface": "#2c2927",
      "bg-elevated": "#33302d",
      "bg-floating": "#201e1c",
      "bg-input": "#201e1c",
      "bg-input-elevated": "#3b3733",
      border: "#45403b",
    },
    light: {
      "bg-base": "#e9e6e1",
      "bg-surface": "#f6f4f0",
      "bg-elevated": "#ffffff",
      "bg-floating": "#ffffff",
      "bg-input": "#efece7",
      "bg-input-elevated": "#ffffff",
      border: "#d9d4cc",
    },
  },
  ink: {
    dark: {
      "bg-base": "#0b0c0e",
      "bg-surface": "#121316",
      "bg-elevated": "#17181c",
      "bg-floating": "#0b0c0e",
      "bg-input": "#0b0c0e",
      "bg-input-elevated": "#1f2126",
      border: "#2a2c31",
    },
    light: {
      "bg-base": "#f4f4f5",
      "bg-surface": "#fafafa",
      "bg-elevated": "#ffffff",
      "bg-floating": "#ffffff",
      "bg-input": "#f4f4f5",
      "bg-input-elevated": "#ffffff",
      border: "#e4e4e7",
    },
  },
} as const satisfies Record<
  Exclude<PresetNeutral, "slate">,
  Record<PresetMode, Surfaces>
>

/*
 * `soft` is the pair `tokens.css` ships, so it too writes nothing. The alphas
 * are tuned per surface set: a shadow that reads on a dark surface is a smudge
 * on a light one.
 */
const SHADOW_SCALES = {
  flat: {
    dark: { low: "none", high: "0 0 0 1px var(--newt-border)" },
    light: { low: "none", high: "0 0 0 1px var(--newt-border)" },
  },
  deep: {
    dark: {
      low: "0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.2)",
      high: "0 16px 40px rgba(0, 0, 0, 0.45)",
    },
    light: {
      low: "0 1px 2px rgba(6, 6, 7, 0.12), 0 2px 6px rgba(6, 6, 7, 0.08)",
      high: "0 16px 40px rgba(6, 6, 7, 0.18)",
    },
  },
} as const satisfies Record<
  Exclude<PresetShadow, "soft">,
  Record<PresetMode, { low: string; high: string }>
>

function surfacesOf(preset: Preset): Record<PresetMode, Surfaces> | undefined {
  return preset.n === "slate" ? undefined : NEUTRAL_SURFACES[preset.n]
}

function shadowsOf(
  preset: Preset
): Record<PresetMode, { low: string; high: string }> | undefined {
  return preset.s === "soft" ? undefined : SHADOW_SCALES[preset.s]
}

/** The heading stack: its own font, or the body's when it is `same`. */
function displayFont(preset: Preset): string {
  return FONT_STACKS[preset.h === "same" ? preset.f : preset.h].display
}

function surfaceLines(surfaces: Surfaces): string[] {
  return SURFACE_TOKENS.map((name) => `  --newt-${name}: ${surfaces[name]};`)
}

/**
 * The block is fenced by two comments rather than opened by one: `apply`
 * replaces what is between them, and a reader who wants the preset gone can
 * delete exactly that region without guessing where it ends.
 */
export const PRESET_MARKER = "/* newt/ui preset"
export const PRESET_END_MARKER = "/* end newt/ui preset */"

/** Where `init` puts the dark surface set unless `--dark-selector` says otherwise. */
const DEFAULT_DARK_SELECTOR = ".dark"

/** One rule for the dark surface set: a selector, or a media query around `:root`. */
function darkRule(selector: string, lines: readonly string[]): string[] {
  if (selector.startsWith("@media")) {
    return [
      `${selector} {`,
      "  :root {",
      ...lines.map((line) => `  ${line}`),
      "  }",
      "}",
    ]
  }
  return [`${selector} {`, ...lines, "}"]
}

/**
 * The overrides as a CSS block, meant to sit after the token block rather than
 * inside it: the tokens stay the file the registry ships, and the preset is a
 * short list of declarations layered on top that a reader can delete in one
 * selection.
 *
 * `init` writes the light surface set to `:root` and the dark one under the
 * project's dark selector, so the surfaces and shadows a preset restates follow
 * the same layout: light in `:root`, dark under `darkSelector`.
 */
export function presetToCss(
  preset: Preset,
  darkSelector: string = DEFAULT_DARK_SELECTOR
): string {
  const code = encodePreset(preset)
  const radius = RADIUS_SCALES[preset.r]
  const font = FONT_STACKS[preset.f]
  const surfaces = surfacesOf(preset)
  const shadows = shadowsOf(preset)

  const lines = [
    `${PRESET_MARKER} ${code} — newt/create */`,
    ":root {",
    `  --newt-brand: ${preset.b.toLowerCase()};`,
    `  --newt-brand-hover: ${darken(preset.b, 0.15)};`,
    `  --newt-brand-active: ${darken(preset.b, 0.3)};`,
    "",
    `  --newt-radius-sm: ${radius.sm};`,
    `  --newt-radius-md: ${radius.md};`,
    `  --newt-radius-lg: ${radius.lg};`,
    "",
    `  --newt-font-sans: ${font.sans};`,
    `  --newt-font-display: ${displayFont(preset)};`,
  ]

  const dark: string[] = []
  if (shadows !== undefined) {
    lines.push(
      "",
      `  --newt-shadow-elevation-low: ${shadows.light.low};`,
      `  --newt-shadow-elevation-high: ${shadows.light.high};`
    )
    if (shadows.dark.low !== shadows.light.low) {
      dark.push(`  --newt-shadow-elevation-low: ${shadows.dark.low};`)
    }
    if (shadows.dark.high !== shadows.light.high) {
      dark.push(`  --newt-shadow-elevation-high: ${shadows.dark.high};`)
    }
  }
  if (surfaces !== undefined) {
    lines.push("", ...surfaceLines(surfaces.light))
    dark.push(...surfaceLines(surfaces.dark))
  }
  lines.push("}")

  if (dark.length > 0) {
    lines.push(
      "",
      "/* The same choices for the dark surface set. */",
      ...darkRule(darkSelector, dark)
    )
  }

  if (preset.m === "light") {
    lines.push(
      "",
      '/* Light is the default surface set: put data-newt-theme="light" on <html>. */',
      ":root {",
      "  color-scheme: light;",
      "}"
    )
  }

  if (preset.d === "rtl") {
    lines.push(
      "",
      '/* Right to left by default: dir="rtl" belongs on <html> as well. */',
      ":root {",
      "  --newt-dir: -1;",
      "}"
    )
  }

  lines.push("", PRESET_END_MARKER)
  return `${lines.join("\n")}\n`
}
