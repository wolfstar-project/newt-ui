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

export const expressionKinds: { kind: ExpressionKind; label: string }[] = [
  { kind: "gif", label: "GIFs" },
  { kind: "sticker", label: "Stickers" },
  { kind: "emoji", label: "Emoji" },
]

export const skinTones: { tone: SkinTone; label: string; sample: string }[] = [
  { tone: 0, label: "Default skin tone", sample: "👋" },
  { tone: 1, label: "Light skin tone", sample: "👋🏻" },
  { tone: 2, label: "Medium-light skin tone", sample: "👋🏼" },
  { tone: 3, label: "Medium skin tone", sample: "👋🏽" },
  { tone: 4, label: "Medium-dark skin tone", sample: "👋🏾" },
  { tone: 5, label: "Dark skin tone", sample: "👋🏿" },
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
  query: string
): ExpressionSection[] {
  const ofKind = items.filter((item) => item.kind === kind)
  if (query.trim()) {
    const found = ofKind.filter((item) => matchesExpression(item, query))
    return found.length
      ? [
          {
            key: "results",
            label: "Search results",
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
      label: "Recently used",
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
  `inline-flex min-h-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] min-w-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] cursor-pointer items-center justify-center gap-[var(--newt-space-1)] rounded-md border-0 px-[var(--newt-space-3)] font-sans text-[length:var(--newt-font-size-sm)] font-semibold leading-[var(--newt-line-height-normal)] enabled:hover:bg-newt-bg-hover enabled:hover:text-newt-text-primary enabled:active:bg-newt-bg-active disabled:cursor-not-allowed disabled:text-newt-text-muted ${expressionsFocusRing}`,
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
