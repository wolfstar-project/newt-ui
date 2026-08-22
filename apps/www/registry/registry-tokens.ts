/**
 * The `--newt-*` design tokens, expressed once and projected into both Tailwind
 * versions so a single registry serves v3 and v4 consumers.
 *
 * Source of truth for the values: `packages/newt-ui/registry/html/tokens.css`.
 *
 * - Tailwind v3 reads `tailwindV3Theme` and merges it into `theme.extend` of
 *   the user's `tailwind.config.ts`.
 * - Tailwind v4 reads `tailwindV4Theme` and writes it into an `@theme` block;
 *   there is no JS config in v4, utilities are generated from these namespaced
 *   custom properties (`--color-*` yields `bg-*`/`text-*`/`border-*`, etc).
 *
 * Both forms point at the same raw `--newt-*` variables, which are emitted
 * separately as `cssVars.dark` — so a consumer can still restyle the library by
 * overriding one variable, exactly like the plain HTML/CSS distribution.
 */

/** Raw token values, written to `:root` / the dark selector. */
export const newtTokens = {
  "newt-bg-base": "#1e1f22",
  "newt-bg-surface": "#2b2d31",
  "newt-bg-elevated": "#313338",
  "newt-bg-floating": "#1e1f22",
  "newt-bg-input": "#1e1f22",
  "newt-bg-hover": "rgba(78, 80, 88, 0.4)",
  "newt-bg-active": "rgba(78, 80, 88, 0.6)",
  "newt-border": "#3f4147",
  "newt-text-primary": "#f2f3f5",
  "newt-text-secondary": "#b5bac1",
  "newt-text-muted": "#949ba4",
  "newt-text-link": "#00a8fc",
  "newt-brand": "#5865f2",
  "newt-brand-hover": "#4752c4",
  "newt-brand-active": "#3c45a5",
  "newt-online": "#23a55a",
  "newt-idle": "#f0b232",
  "newt-dnd": "#f23f42",
  "newt-offline": "#80848e",
  "newt-danger": "#da373c",
  "newt-danger-hover": "#a12828",
  "newt-font-sans":
    '"Inter", "gg sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  "newt-font-mono":
    '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  "newt-font-display": '"Inter", sans-serif',
  "newt-radius-sm": "4px",
  "newt-radius-md": "8px",
  "newt-radius-lg": "12px",
  "newt-radius-full": "9999px",
  "newt-shadow-elevation-low":
    "0 1px 0 rgba(0,0,0,0.2), 0 1.5px 0 rgba(0,0,0,0.05), 0 2px 0 rgba(0,0,0,0.05)",
  "newt-shadow-elevation-high": "0 8px 16px rgba(0,0,0,0.24)",
  "newt-ease": "cubic-bezier(0.3, 0.7, 0.4, 1)",
  "newt-duration-fast": "100ms",
  "newt-duration-base": "150ms",
} satisfies Record<string, string>

/** Colour tokens, in the order the docs sidebar and the token table use. */
const COLORS = [
  "bg-base",
  "bg-surface",
  "bg-elevated",
  "bg-floating",
  "bg-input",
  "bg-hover",
  "bg-active",
  "border",
  "text-primary",
  "text-secondary",
  "text-muted",
  "text-link",
  "brand",
  "brand-hover",
  "brand-active",
  "online",
  "idle",
  "dnd",
  "offline",
  "danger",
  "danger-hover",
] as const

const RADII = ["sm", "md", "lg", "full"] as const
const FONTS = ["sans", "mono", "display"] as const
const SHADOWS = ["elevation-low", "elevation-high"] as const

/**
 * Tailwind v4 `@theme` entries. Each one aliases the matching `--newt-*`
 * variable rather than duplicating its value, so overriding the variable at
 * runtime still restyles every generated utility.
 */
export const tailwindV4Theme = {
  ...Object.fromEntries(
    COLORS.map(
      (name) => [`--color-newt-${name}`, `var(--newt-${name})`] as const
    )
  ),
  ...Object.fromEntries(
    RADII.map(
      (name) => [`--radius-${name}`, `var(--newt-radius-${name})`] as const
    )
  ),
  ...Object.fromEntries(
    FONTS.map((name) => [`--font-${name}`, `var(--newt-font-${name})`] as const)
  ),
  ...Object.fromEntries(
    SHADOWS.map(
      (name) => [`--shadow-${name}`, `var(--newt-shadow-${name})`] as const
    )
  ),
  "--ease-newt": "var(--newt-ease)",
} satisfies Record<string, string>

/**
 * Tailwind v3 `theme.extend`. Same utilities, expressed the way a v3 JS config
 * expects them.
 */
type TailwindV3Theme = {
  colors: { newt: Record<string, string> }
  fontFamily: Record<string, string>
  borderRadius: Record<string, string>
  boxShadow: Record<string, string>
  transitionTimingFunction: Record<string, string>
  transitionDuration: Record<string, string>
}

export const tailwindV3Theme = {
  colors: {
    newt: Object.fromEntries(
      COLORS.map(
        (name) =>
          [name === "border" ? "border" : name, `var(--newt-${name})`] as const
      )
    ),
  },
  fontFamily: Object.fromEntries(
    FONTS.map((name) => [name, `var(--newt-font-${name})`] as const)
  ),
  borderRadius: Object.fromEntries(
    RADII.map((name) => [name, `var(--newt-radius-${name})`] as const)
  ),
  boxShadow: Object.fromEntries(
    SHADOWS.map((name) => [name, `var(--newt-shadow-${name})`] as const)
  ),
  transitionTimingFunction: { newt: "var(--newt-ease)" },
  transitionDuration: { fast: "100ms", base: "150ms" },
} satisfies TailwindV3Theme
