import { newtTokens, tailwindV3Theme, tailwindV4Theme } from "./registry-tokens"
import type { Registry } from "./schema"

/**
 * newt/ui ships a single Discord-inspired dark theme driven by --newt-* vars.
 *
 * The item carries the tokens three ways so one registry serves both Tailwind
 * versions: `cssVars.dark` holds the raw variables, `cssVars.theme` the v4
 * `@theme` entries, and `tailwind.config.theme` the v3 `theme.extend`.
 */
export const themes: Registry = [
  {
    name: "theme-newt",
    type: "registry:theme",
    title: "newt/ui theme",
    description:
      "The Discord-inspired --newt-* design tokens, for Tailwind v3 and v4.",
    cssVars: {
      theme: tailwindV4Theme,
      dark: newtTokens,
    },
    tailwind: { config: { theme: { extend: tailwindV3Theme } } },
  },
]
