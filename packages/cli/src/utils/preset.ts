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

export const PRESET_RADII = ["sm", "md", "lg"] as const
export const PRESET_FONTS = ["inter", "system", "mono-first"] as const
export const PRESET_MODES = ["dark", "light"] as const
export const PRESET_DIRECTIONS = ["ltr", "rtl"] as const

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
})

export type Preset = z.infer<typeof presetSchema>

export const DEFAULT_PRESET: Preset = {
  v: PRESET_VERSION,
  t: "next",
  b: "#5865f2",
  r: "md",
  f: "inter",
  m: "dark",
  d: "ltr",
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
  const ordered = {
    v: parsed.v,
    t: parsed.t,
    b: parsed.b.toLowerCase(),
    r: parsed.r,
    f: parsed.f,
    m: parsed.m,
    d: parsed.d,
  }
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
  sm: { sm: "2px", md: "4px", lg: "6px" },
  md: { sm: "4px", md: "8px", lg: "12px" },
  lg: { sm: "6px", md: "12px", lg: "18px" },
} as const

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
  "mono-first": {
    sans: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
    display: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  },
} as const

/**
 * The block is fenced by two comments rather than opened by one: `apply`
 * replaces what is between them, and a reader who wants the preset gone can
 * delete exactly that region without guessing where it ends.
 */
export const PRESET_MARKER = "/* newt/ui preset"
export const PRESET_END_MARKER = "/* end newt/ui preset */"

/**
 * The overrides as a CSS block, meant to sit after the token block rather than
 * inside it: the tokens stay the file the registry ships, and the preset is a
 * short list of declarations layered on top that a reader can delete in one
 * selection.
 */
export function presetToCss(preset: Preset): string {
  const code = encodePreset(preset)
  const radius = RADIUS_SCALES[preset.r]
  const font = FONT_STACKS[preset.f]

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
    `  --newt-font-display: ${font.display};`,
    "}",
  ]

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
