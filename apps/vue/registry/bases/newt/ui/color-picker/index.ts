export { default as ColorPicker } from "./ColorPicker.vue"

/** One entry of the palette. */
export interface ColorSwatch {
  /** Any CSS colour; a hex string if the custom tile should round-trip it. */
  value: string
  /** What a screen reader calls it. */
  label: string
}

/*
 * A starting palette, not a token set: these are values a user picks and an
 * application stores, so they are data rather than part of the theme.
 */
export const defaultSwatches: readonly ColorSwatch[] = [
  { value: "#5865f2", label: "Indigo" },
  { value: "#3ba55d", label: "Green" },
  { value: "#1abc9c", label: "Teal" },
  { value: "#3498db", label: "Blue" },
  { value: "#9b59b6", label: "Purple" },
  { value: "#eb459e", label: "Pink" },
  { value: "#f0b232", label: "Amber" },
  { value: "#e67e22", label: "Orange" },
  { value: "#ed4245", label: "Red" },
  { value: "#95a5a6", label: "Grey" },
]
