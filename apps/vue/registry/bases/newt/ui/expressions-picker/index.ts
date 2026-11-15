import { cva } from "class-variance-authority"
export { default as ExpressionsPicker } from "./ExpressionsPicker.vue"

export type ExpressionKind = "emoji" | "sticker" | "gif"

/** A section of one tab: a Unicode emoji group, a server's own emoji, or a sticker pack. */
export interface ExpressionCategory {
  /** Unique across all categories. */
  id: string
  kind: ExpressionKind
  label: string
  /** A Unicode character for the category rail. */
  glyph?: string
  /** A static image for the category rail, such as a server icon. Wins over `glyph`. */
  iconSrc?: string
}

export interface ExpressionItem {
  /** Unique across all items. */
  id: string
  kind: ExpressionKind
  /** The `id` of the category this item belongs to. */
  category: string
  /** Accessible name, searched and shown in the preview bar. */
  label: string
  /** What a selection returns: Unicode text, or an application token for media. */
  value: string
  keywords?: readonly string[]
  /** The emoji in the five skin tones, light to dark. Omit when it has none. */
  skins?: readonly string[]
  /** A static image: a server emoji, a sticker, or a GIF poster. */
  src?: string
  disabled?: boolean
}

export type SkinTone = 0 | 1 | 2 | 3 | 4 | 5

/** Every name and text the picker writes itself. */
export interface ExpressionsPickerLabels {
  /** Name of the tab list. */
  kinds: string
  gif: string
  sticker: string
  emoji: string
  /** Name of the search field. */
  search: string
  searchPlaceholder: string
  clearSearch: string
  /** Name of the skin tone button, built from the current tone's name. */
  skinTone: (tone: string) => string
  /** Name of the group of skin tones. */
  skinTones: string
  /** The six skin tones, from the default to the darkest. */
  toneNames: readonly [string, string, string, string, string, string]
  /** Name of the category rail. */
  categories: string
  searchResults: string
  recent: string
  noResults: string
  noResultsHelp: string
  empty: string
  emptyHelp: string
  /** Read out after each search. */
  resultCount: (count: number) => string
  /** Written before the category name in the preview bar. */
  from: string
  /** The preview bar while nothing is hovered or chosen. */
  hint: string
}

/** The English defaults. */
export const defaultExpressionsPickerLabels: ExpressionsPickerLabels = {
  kinds: "Expression type",
  gif: "GIFs",
  sticker: "Stickers",
  emoji: "Emoji",
  search: "Search expressions",
  searchPlaceholder: "Search by name or keyword",
  clearSearch: "Clear search",
  skinTone: (tone) => `Skin tone: ${tone}`,
  skinTones: "Skin tone",
  toneNames: [
    "Default skin tone",
    "Light skin tone",
    "Medium-light skin tone",
    "Medium skin tone",
    "Medium-dark skin tone",
    "Dark skin tone",
  ],
  categories: "Categories",
  searchResults: "Search results",
  recent: "Recently used",
  noResults: "No expressions match your search.",
  noResultsHelp: "Try another word or another tab.",
  empty: "Nothing here yet.",
  emptyHelp: "Try another tab.",
  resultCount: (count) => (count === 1 ? "1 result" : `${count} results`),
  from: "from",
  hint: "Hover or focus an expression to preview it.",
}

export const expressionKinds: readonly ExpressionKind[] = [
  "gif",
  "sticker",
  "emoji",
]

export const skinTones: { tone: SkinTone; sample: string }[] = [
  { tone: 0, sample: "👋" },
  { tone: 1, sample: "👋🏻" },
  { tone: 2, sample: "👋🏼" },
  { tone: 3, sample: "👋🏽" },
  { tone: 4, sample: "👋🏾" },
  { tone: 5, sample: "👋🏿" },
]

/** The value of an item in a skin tone, or its own value when it has none. */
export function expressionValue(item: ExpressionItem, tone: SkinTone): string {
  return (tone === 0 ? undefined : item.skins?.[tone - 1]) ?? item.value
}

/** `:grinning_face:` for an emoji, the label for media. */
export function expressionShortcode(item: ExpressionItem): string {
  if (item.kind !== "emoji") return item.label
  const name = item.label
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, "_")
    .replaceAll(/^_+|_+$/gu, "")
  return `:${name}:`
}

/** Every word of the query must appear in the label or the keywords. */
export function matchesExpression(item: ExpressionItem, query: string) {
  const text = [item.label, ...(item.keywords ?? [])].join(" ").toLowerCase()
  return query
    .toLowerCase()
    .split(/[\s_:]+/u)
    .filter(Boolean)
    .every((word) => text.includes(word))
}

export interface ExpressionSection {
  key: string
  label: string
  glyph?: string
  iconSrc?: string
  items: ExpressionItem[]
  collapsible: boolean
}

export function buildExpressionSections(
  items: readonly ExpressionItem[],
  categories: readonly ExpressionCategory[],
  recent: readonly string[],
  kind: ExpressionKind,
  query: string,
  labels: Pick<ExpressionsPickerLabels, "searchResults" | "recent">
): ExpressionSection[] {
  const ofKind = items.filter((item) => item.kind === kind)
  if (query.trim()) {
    const found = ofKind.filter((item) => matchesExpression(item, query))
    return found.length
      ? [
          {
            key: "results",
            label: labels.searchResults,
            items: found,
            collapsible: false,
          },
        ]
      : []
  }
  const byId = new Map(ofKind.map((item) => [item.id, item]))
  const sections: ExpressionSection[] = []
  const used = recent.flatMap((id) => {
    const item = byId.get(id)
    return item ? [item] : []
  })
  if (used.length)
    sections.push({
      key: "recent",
      label: labels.recent,
      glyph: "🕘",
      items: used,
      collapsible: true,
    })
  for (const category of categories) {
    if (category.kind !== kind) continue
    const list = ofKind.filter((item) => item.category === category.id)
    if (list.length)
      sections.push({
        key: `category-${category.id}`,
        label: category.label,
        glyph: category.glyph,
        iconSrc: category.iconSrc,
        items: list,
        collapsible: true,
      })
  }
  return sections
}

/** The cell an arrow key leads to, by where the cells sit on screen. */
export function neighbourCell(
  cells: HTMLElement[],
  index: number,
  key: string,
  rtl: boolean
): HTMLElement | undefined {
  if (key === (rtl ? "ArrowLeft" : "ArrowRight")) return cells[index + 1]
  if (key === (rtl ? "ArrowRight" : "ArrowLeft")) return cells[index - 1]
  if (key === "Home") return cells[0]
  if (key === "End") return cells.at(-1)
  if (key !== "ArrowDown" && key !== "ArrowUp") return undefined
  const from = cells[index]?.getBoundingClientRect()
  if (!from) return undefined
  const step = key === "ArrowDown" ? 1 : -1
  let rowTop: number | null = null
  let best: { cell: HTMLElement; distance: number } | undefined
  for (let at = index + step; at >= 0 && at < cells.length; at += step) {
    const cell = cells[at]
    if (!cell) break
    const rect = cell.getBoundingClientRect()
    if (Math.abs(rect.top - from.top) < 4) continue
    rowTop ??= rect.top
    if (Math.abs(rect.top - rowTop) >= 4) break
    const distance = Math.abs(rect.left - from.left)
    if (!best || distance < best.distance) best = { cell, distance }
  }
  return best?.cell
}

export const expressionsFocusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"

/** Tabs and the small controls of the panel. */
export const expressionsPickerVariants = cva(
  `inline-flex min-h-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] min-w-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] cursor-pointer items-center justify-center gap-[var(--newt-space-1)] rounded-[var(--newt-radius-md)] border-0 px-[var(--newt-space-3)] font-[family-name:var(--newt-font-sans)] text-[length:var(--newt-font-size-sm)] font-semibold leading-[var(--newt-line-height-normal)] enabled:hover:bg-newt-bg-hover enabled:hover:text-newt-text-primary enabled:active:bg-newt-bg-active disabled:cursor-not-allowed disabled:text-newt-text-muted ${expressionsFocusRing}`,
  {
    variants: {
      selected: {
        true: "bg-newt-bg-active text-newt-text-primary",
        false: "bg-transparent text-newt-text-secondary",
      },
    },
    defaultVariants: { selected: false },
  }
)
