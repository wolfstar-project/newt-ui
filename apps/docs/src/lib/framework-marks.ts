import type { FrameworkId } from "./install-targets"

/*
 * One glyph per installation target, as data rather than markup: the picker
 * grid renders them from Astro and newt/create renders them from React, and a
 * second copy of the paths would drift the first time one is nudged.
 *
 * They are drawn here rather than taken from each project's brand kit. A
 * framework is recognised by its silhouette long before its wordmark is
 * legible at 24px, and a `currentColor` path follows the theme, the light
 * palette and a hover state for free.
 */
export type GlyphPart =
  | { readonly kind: "path"; readonly d: string; readonly filled?: boolean }
  | {
      readonly kind: "circle"
      readonly cx: number
      readonly cy: number
      readonly r: number
      readonly filled?: boolean
    }

export const FRAMEWORK_MARKS = {
  next: [
    { kind: "circle", cx: 12, cy: 12, r: 9 },
    { kind: "path", d: "M9.2 15.5v-7l6 7" },
    { kind: "path", d: "M14.6 8.5v3.4" },
  ],
  "vite-react": [
    { kind: "path", d: "M2.8 5.2 12 21.5 21.2 5.2" },
    {
      kind: "path",
      d: "M13.4 7.6 10.6 13h2.4l-.9 4.2 3.5-5.8h-2.5z",
      filled: true,
    },
  ],
  "vite-vue": [
    { kind: "path", d: "M2.8 5.2 12 21.5 21.2 5.2" },
    {
      kind: "path",
      d: "M13.4 7.6 10.6 13h2.4l-.9 4.2 3.5-5.8h-2.5z",
      filled: true,
    },
  ],
  nuxt: [
    { kind: "path", d: "M9.5 19.5h11L15 9.5z" },
    { kind: "path", d: "M8.2 12.2 3.5 19.5h5.4" },
  ],
  astro: [
    { kind: "path", d: "M12 2.5 6.5 20.5" },
    { kind: "path", d: "M12 2.5 17.5 20.5" },
    { kind: "path", d: "M8.6 17.6c-.6 1.9.6 3.6 3.4 3.6s4-1.7 3.4-3.6" },
  ],
  "tanstack-start": [
    { kind: "path", d: "M4 8 12 4l8 4-8 4z" },
    { kind: "path", d: "M4 13.5 12 17.5l8-4" },
    { kind: "path", d: "M4 17.5 12 21.5l8-4" },
  ],
  "react-router": [
    { kind: "path", d: "M4.5 17.5c3.5 0 3.5-11 7-11s3.5 11 7 11" },
    { kind: "circle", cx: 4.5, cy: 17.5, r: 1.7, filled: true },
    { kind: "circle", cx: 18.5, cy: 17.5, r: 1.7, filled: true },
  ],
  laravel: [
    { kind: "path", d: "M3 14 7 7.5 11 14 7 20.5z" },
    { kind: "path", d: "M12 11 16 4.5 20 11l-4 6.5z" },
  ],
  manual: [
    {
      kind: "path",
      d: "M17.5 3.5a4.5 4.5 0 0 0-4.3 5.8L4 18.5 5.5 20l9.2-9.2a4.5 4.5 0 0 0 5.8-4.3l-2.7 2.7-2.8-.8-.8-2.8z",
    },
  ],
  html: [
    { kind: "path", d: "M9 6.5 4 12l5 5.5" },
    { kind: "path", d: "M15 6.5 20 12l-5 5.5" },
    { kind: "path", d: "M13.2 4.5 10.8 19.5" },
  ],
} as const satisfies Record<FrameworkId, readonly GlyphPart[]>

/**
 * The two Vite entries share the bolt, so their titles carry the difference.
 * The framework hue is reinforcement, never the only signal.
 */
export function markTint(id: FrameworkId): "react" | "vue" | undefined {
  if (id === "vite-react") return "react"
  if (id === "vite-vue") return "vue"
  return undefined
}
