export { default as CommandPalette } from "./CommandPalette.vue"

/** One row of the palette. */
export interface CommandItem {
  /** Unique across the whole palette; handed back by the `select` event. */
  id: string
  label: string
  /** The quieter text beside the label. */
  description?: string
  /** A one-character sign before the label, such as `#` or `@`. */
  prefix?: string
  /** A key combination shown at the end of the row. */
  shortcut?: string
  /** Extra words the search should match that the row does not show. */
  keywords?: readonly string[]
}

export interface CommandGroup {
  label: string
  items: readonly CommandItem[]
}

/** The three lines of the footer. */
export interface CommandPaletteHints {
  move: string
  select: string
  close: string
}
