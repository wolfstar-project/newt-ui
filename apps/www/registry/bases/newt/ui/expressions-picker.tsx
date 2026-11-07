"use client"

import { cva } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

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

export interface ExpressionsPickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  items?: readonly ExpressionItem[]
  categories?: readonly ExpressionCategory[]
  /** Item IDs used last, most recent first. The application stores and updates them. */
  recent?: readonly string[]
  /** The value chosen now, marked as pressed in the grid. */
  current?: string | null
  label?: string
  disabled?: boolean
  /** Receives the item and its value in the chosen skin tone. */
  onSelect?: (item: ExpressionItem, value: string) => void
}

const kinds: { kind: ExpressionKind; label: string }[] = [
  { kind: "emoji", label: "Emoji" },
  { kind: "sticker", label: "Stickers" },
  { kind: "gif", label: "GIFs" },
]

const skinTones: { tone: SkinTone; label: string; sample: string }[] = [
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

interface Section {
  key: string
  label: string
  glyph?: string
  iconSrc?: string
  items: ExpressionItem[]
  collapsible: boolean
}

function buildSections(
  items: readonly ExpressionItem[],
  categories: readonly ExpressionCategory[],
  recent: readonly string[],
  kind: ExpressionKind,
  query: string
): Section[] {
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
  const sections: Section[] = []
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
function neighbour(
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

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"

/** Tabs and the small controls of the panel. */
export const expressionsPickerVariants = cva(
  `inline-flex min-h-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] min-w-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] cursor-pointer items-center justify-center gap-[var(--newt-space-1)] rounded-sm border-0 px-[var(--newt-space-2)] font-sans text-[length:var(--newt-font-size-sm)] font-semibold leading-[var(--newt-line-height-normal)] enabled:hover:bg-newt-bg-hover enabled:hover:text-newt-text-primary enabled:active:bg-newt-bg-active disabled:cursor-not-allowed disabled:text-newt-text-muted ${focusRing}`,
  {
    variants: {
      selected: {
        true: "bg-newt-bg-active text-newt-text-primary underline underline-offset-[var(--newt-space-1)]",
        false: "bg-transparent text-newt-text-secondary",
      },
    },
    defaultVariants: { selected: false },
  }
)

const triggerClass = `min-h-[var(--newt-expressions-target-size)] cursor-pointer rounded-sm border border-newt-border bg-newt-bg-elevated px-[var(--newt-space-3)] py-[var(--newt-space-2)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary enabled:hover:bg-newt-bg-hover enabled:active:bg-newt-bg-active disabled:cursor-not-allowed disabled:text-newt-text-muted ${focusRing}`

function trapFocus(event: React.KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return
  const controls = [
    ...event.currentTarget.querySelectorAll<HTMLElement>(
      "button:not(:disabled), input:not(:disabled)"
    ),
  ].filter(
    (element) => element.tabIndex >= 0 && element.getClientRects().length > 0
  )
  const first = controls[0]
  const last = controls[controls.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

function ExpressionArt({
  item,
  value,
  large,
}: {
  item: ExpressionItem
  value: string
  large?: boolean
}) {
  if (item.src)
    return (
      <img
        src={item.src}
        alt=""
        loading="lazy"
        className={cn(
          "object-contain",
          large
            ? "size-[calc(var(--newt-expressions-preview-size)-var(--newt-space-3))]"
            : "size-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))]"
        )}
      />
    )
  if (item.kind === "emoji")
    return (
      <span
        aria-hidden="true"
        className="text-[length:var(--newt-font-size-expression)] leading-none"
      >
        {value}
      </span>
    )
  return (
    <span
      aria-hidden="true"
      className="px-[var(--newt-space-1)] text-center text-[length:var(--newt-font-size-xs)] text-newt-text-secondary"
    >
      {item.label}
    </span>
  )
}

const ExpressionsPicker = React.forwardRef<
  HTMLDivElement,
  ExpressionsPickerProps
>(
  (
    {
      items = [],
      categories = [],
      recent = [],
      current = null,
      label = "Choose an expression",
      disabled = false,
      onSelect,
      className,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const dialog = React.useRef<HTMLDialogElement>(null)
    const trigger = React.useRef<HTMLButtonElement>(null)
    const search = React.useRef<HTMLInputElement>(null)
    const scroller = React.useRef<HTMLDivElement>(null)
    const toneButton = React.useRef<HTMLButtonElement>(null)
    const toneRoot = React.useRef<HTMLDivElement>(null)
    const [open, setOpen] = React.useState(false)
    const [kind, setKind] = React.useState<ExpressionKind>("emoji")
    const [query, setQuery] = React.useState("")
    const [tone, setTone] = React.useState<SkinTone>(0)
    const [showTones, setShowTones] = React.useState(false)
    const [collapsed, setCollapsed] = React.useState<string[]>([])
    const [scrolledTo, setScrolledTo] = React.useState<string | null>(null)
    const [pendingScroll, setPendingScroll] = React.useState<string | null>(
      null
    )
    const [activeKey, setActiveKey] = React.useState<string | null>(null)
    const [hovered, setHovered] = React.useState<{
      item: ExpressionItem
      where: string
    } | null>(null)

    const searching = query.trim().length > 0
    const sections = buildSections(items, categories, recent, kind, query)
    const isOpen = (key: string) => !collapsed.includes(key)
    const activeSection = scrolledTo ?? sections[0]?.key
    const cellKeys = sections
      .filter((section) => isOpen(section.key))
      .flatMap((section) =>
        section.items
          .filter((item) => !item.disabled)
          .map((item) => `${section.key}|${item.id}`)
      )
    const tabKey =
      activeKey && cellKeys.includes(activeKey) ? activeKey : cellKeys[0]
    const resultCount = sections.reduce(
      (count, section) => count + section.items.length,
      0
    )

    const currentItem = React.useMemo(() => {
      if (!current) return null
      const item = items.find(
        (entry) =>
          entry.kind === kind &&
          (entry.value === current || entry.skins?.includes(current))
      )
      if (!item) return null
      return {
        item,
        where:
          categories.find((category) => category.id === item.category)?.label ??
          "",
      }
    }, [categories, current, items, kind])
    const preview = hovered ?? currentItem

    function toggleSection(key: string) {
      setCollapsed((list) =>
        list.includes(key)
          ? list.filter((entry) => entry !== key)
          : [...list, key]
      )
    }
    function goTo(key: string) {
      setCollapsed((list) => list.filter((entry) => entry !== key))
      setScrolledTo(key)
      setPendingScroll(key)
    }
    React.useLayoutEffect(() => {
      if (!pendingScroll || !scroller.current) return
      const section = scroller.current.querySelector<HTMLElement>(
        `[data-section="${pendingScroll}"]`
      )
      if (section) scroller.current.scrollTop = section.offsetTop
      setPendingScroll(null)
    }, [pendingScroll])

    function onScroll() {
      const element = scroller.current
      if (!element) return
      let found: string | null = null
      for (const section of element.querySelectorAll<HTMLElement>(
        "[data-section]"
      )) {
        if (section.offsetTop > element.scrollTop + 8) break
        found = section.dataset.section ?? null
      }
      if (found) setScrolledTo(found)
    }

    function show() {
      if (disabled) return
      setQuery("")
      setHovered(null)
      setShowTones(false)
      dialog.current?.showModal()
      setOpen(true)
      search.current?.focus()
    }
    function close() {
      dialog.current?.close()
    }
    React.useEffect(() => {
      if (disabled) dialog.current?.close()
    }, [disabled])

    function changeKind(next: ExpressionKind) {
      setKind(next)
      setScrolledTo(null)
      setHovered(null)
      setShowTones(false)
      if (scroller.current) scroller.current.scrollTop = 0
    }

    function tabKeyDown(
      event: React.KeyboardEvent<HTMLButtonElement>,
      index: number
    ) {
      const rtl = getComputedStyle(event.currentTarget).direction === "rtl"
      const forward = rtl ? "ArrowLeft" : "ArrowRight"
      const back = rtl ? "ArrowRight" : "ArrowLeft"
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? kinds.length - 1
            : event.key === forward
              ? (index + 1) % kinds.length
              : event.key === back
                ? (index + kinds.length - 1) % kinds.length
                : -1
      const nextTab = kinds[next]
      if (!nextTab) return
      event.preventDefault()
      changeKind(nextTab.kind)
      dialog.current
        ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        .item(next)
        ?.focus()
    }

    function gridKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      const target = event.target
      if (!(target instanceof HTMLElement) || !target.matches("[data-cell]"))
        return
      const cells = [
        ...(scroller.current?.querySelectorAll<HTMLElement>(
          "[data-cell]:not(:disabled)"
        ) ?? []),
      ]
      const rtl = getComputedStyle(target).direction === "rtl"
      const next = neighbour(cells, cells.indexOf(target), event.key, rtl)
      if (!next) return
      event.preventDefault()
      next.focus()
      next.scrollIntoView({ block: "nearest" })
    }

    function focusFirstCell(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key !== "ArrowDown") return
      event.preventDefault()
      scroller.current
        ?.querySelector<HTMLElement>('[data-cell][tabindex="0"]')
        ?.focus()
    }

    function onDialogKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
      if (event.key === "Escape" && showTones) {
        event.preventDefault()
        setShowTones(false)
        toneButton.current?.focus()
        return
      }
      trapFocus(event)
    }

    function pickTone(next: SkinTone) {
      setTone(next)
      setShowTones(false)
      toneButton.current?.focus()
    }
    React.useEffect(() => {
      if (!showTones) return
      toneRoot.current
        ?.querySelector<HTMLElement>('[aria-pressed="true"]')
        ?.focus()
      function outside(event: PointerEvent) {
        const target = event.target
        if (!(target instanceof Node) || !toneRoot.current?.contains(target))
          setShowTones(false)
      }
      document.addEventListener("pointerdown", outside)
      return () => document.removeEventListener("pointerdown", outside)
    }, [showTones])

    function select(item: ExpressionItem) {
      if (disabled || item.disabled) return
      close()
      onSelect?.(item, expressionValue(item, tone))
    }

    const toneSample = skinTones[tone]

    return (
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        <button
          ref={trigger}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={id}
          onClick={show}
          className={triggerClass}
        >
          {label}
        </button>
        <dialog
          ref={dialog}
          id={id}
          aria-label={label}
          onKeyDown={onDialogKeyDown}
          onClose={() => {
            setOpen(false)
            setShowTones(false)
            trigger.current?.focus()
          }}
          className="m-auto box-border h-[min(var(--newt-expressions-height),calc(100dvh-2*var(--newt-space-3)))] w-[min(var(--newt-expressions-width),calc(100%-2*var(--newt-space-3)))] max-w-none overflow-hidden rounded-lg border border-newt-border bg-newt-bg-surface p-0 font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary shadow-elevation-high backdrop:bg-[color-mix(in_srgb,var(--newt-bg-base)_80%,transparent)] open:flex open:flex-col"
        >
          <div className="flex shrink-0 items-center gap-[var(--newt-space-2)] px-[var(--newt-space-3)] pt-[var(--newt-space-3)]">
            <div
              role="tablist"
              aria-label="Expression type"
              className="flex items-center gap-[var(--newt-space-1)]"
            >
              {kinds.map((tab, index) => (
                <button
                  key={tab.kind}
                  id={`${id}-${tab.kind}`}
                  role="tab"
                  type="button"
                  aria-selected={kind === tab.kind}
                  aria-controls={`${id}-panel`}
                  tabIndex={kind === tab.kind ? 0 : -1}
                  onClick={() => changeKind(tab.kind)}
                  onKeyDown={(event) => tabKeyDown(event, index)}
                  className={expressionsPickerVariants({
                    selected: kind === tab.kind,
                  })}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Close expressions picker"
              onClick={close}
              className={cn(expressionsPickerVariants(), "ms-auto")}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="flex shrink-0 items-center gap-[var(--newt-space-2)] border-b border-newt-border p-[var(--newt-space-3)]">
            <div className="relative min-w-0 flex-1">
              <input
                ref={search}
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={query}
                aria-label="Search expressions"
                placeholder="Search by name or keyword"
                onChange={(event) => {
                  setQuery(event.target.value)
                  setHovered(null)
                }}
                onKeyDown={focusFirstCell}
                className={`box-border h-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] w-full rounded-sm border-0 bg-newt-bg-input pe-[calc(var(--newt-expressions-target-size)-var(--newt-space-1))] ps-[var(--newt-space-3)] font-sans text-[length:var(--newt-font-size-sm)] text-newt-text-primary placeholder:text-newt-text-muted ${focusRing}`}
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("")
                    search.current?.focus()
                  }}
                  className={cn(
                    expressionsPickerVariants(),
                    "absolute end-[var(--newt-space-1)] top-1/2 min-h-0 min-w-0 -translate-y-1/2 size-[calc(var(--newt-expressions-target-size)-var(--newt-space-3)-var(--newt-space-1))] p-0"
                  )}
                >
                  <span aria-hidden="true">×</span>
                </button>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="pointer-events-none absolute end-[var(--newt-space-3)] top-1/2 size-[var(--newt-space-3)] -translate-y-1/2 fill-none stroke-newt-text-muted stroke-2"
                >
                  <circle cx="7" cy="7" r="5" />
                  <path d="m11 11 4 4" strokeLinecap="round" />
                </svg>
              )}
            </div>
            {kind === "emoji" ? (
              <div ref={toneRoot} className="relative shrink-0">
                <button
                  ref={toneButton}
                  type="button"
                  aria-label={`Skin tone: ${toneSample?.label}`}
                  aria-expanded={showTones}
                  onClick={() => setShowTones((value) => !value)}
                  className={cn(
                    expressionsPickerVariants({ selected: showTones }),
                    "p-0 no-underline"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="text-[length:var(--newt-font-size-expression)] leading-none"
                  >
                    {toneSample?.sample}
                  </span>
                </button>
                {showTones ? (
                  <div
                    role="group"
                    aria-label="Skin tone"
                    className="absolute -end-[var(--newt-space-1)] -top-[var(--newt-space-1)] z-20 flex flex-col gap-[var(--newt-space-1)] rounded-md border border-newt-border bg-newt-bg-floating p-[var(--newt-space-1)] shadow-elevation-high"
                  >
                    {skinTones.map((option) => (
                      <button
                        key={option.tone}
                        type="button"
                        aria-label={option.label}
                        title={option.label}
                        aria-pressed={tone === option.tone}
                        onClick={() => pickTone(option.tone)}
                        className={cn(
                          expressionsPickerVariants(),
                          "p-0 aria-pressed:bg-newt-bg-active aria-pressed:shadow-[inset_0_0_0_2px_var(--newt-brand)]"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="text-[length:var(--newt-font-size-expression)] leading-none"
                        >
                          {option.sample}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          <div
            id={`${id}-panel`}
            role="tabpanel"
            aria-labelledby={`${id}-${kind}`}
            className="flex min-h-0 flex-1"
          >
            {!searching && sections.length > 1 ? (
              <nav
                aria-label="Categories"
                className="flex w-[calc(var(--newt-expressions-target-size)+var(--newt-space-2))] shrink-0 flex-col items-center gap-[var(--newt-space-1)] overflow-y-auto overflow-x-hidden border-e border-newt-border p-[var(--newt-space-2)]"
              >
                {sections.map((section) => (
                  <button
                    key={section.key}
                    type="button"
                    aria-label={section.label}
                    title={section.label}
                    aria-current={
                      activeSection === section.key ? "true" : undefined
                    }
                    onClick={() => goTo(section.key)}
                    className={cn(
                      expressionsPickerVariants({
                        selected: activeSection === section.key,
                      }),
                      "shrink-0 p-0 no-underline aria-[current=true]:shadow-[inset_0_0_0_2px_var(--newt-border)]"
                    )}
                  >
                    {section.iconSrc ? (
                      <img
                        src={section.iconSrc}
                        alt=""
                        className="size-[calc(var(--newt-expressions-target-size)-var(--newt-space-3)-var(--newt-space-1))] rounded-full"
                      />
                    ) : (
                      <span aria-hidden="true" className="leading-none">
                        {section.glyph ?? section.label.slice(0, 1)}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            ) : null}

            <div
              ref={scroller}
              onScroll={onScroll}
              onKeyDown={gridKeyDown}
              onMouseLeave={() => setHovered(null)}
              className="relative min-w-0 flex-1 overflow-y-auto px-[var(--newt-space-2)] pb-[var(--newt-space-2)]"
            >
              {sections.map((section) => (
                <section
                  key={section.key}
                  data-section={section.key}
                  aria-labelledby={`${id}-${section.key}-title`}
                >
                  <h3
                    id={`${id}-${section.key}-title`}
                    className="sticky top-0 z-10 m-0 bg-newt-bg-surface pb-[var(--newt-space-1)] pt-[var(--newt-space-2)] text-[length:var(--newt-font-size-xs)] font-semibold uppercase text-newt-text-secondary"
                  >
                    {section.collapsible ? (
                      <button
                        type="button"
                        aria-expanded={isOpen(section.key)}
                        aria-controls={`${id}-${section.key}`}
                        onClick={() => toggleSection(section.key)}
                        className={`flex w-full cursor-pointer items-center gap-[var(--newt-space-1)] rounded-sm border-0 bg-transparent px-[var(--newt-space-1)] font-[inherit] uppercase text-[inherit] hover:text-newt-text-primary ${focusRing}`}
                      >
                        <span className="min-w-0 truncate">
                          {section.label}
                        </span>
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 16 16"
                          className={cn(
                            "ms-auto size-[var(--newt-space-3)] shrink-0 fill-none stroke-current stroke-2",
                            !isOpen(section.key) &&
                              "[transform:rotate(calc(-90deg*var(--newt-dir)))]"
                          )}
                        >
                          <path
                            d="m4 6 4 4 4-4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    ) : (
                      <span className="px-[var(--newt-space-1)]">
                        {section.label}
                      </span>
                    )}
                  </h3>
                  {isOpen(section.key) ? (
                    <div
                      id={`${id}-${section.key}`}
                      className={cn(
                        "grid pt-[var(--newt-space-1)]",
                        kind === "emoji"
                          ? "grid-cols-[repeat(auto-fill,var(--newt-expressions-target-size))]"
                          : "grid-cols-[repeat(auto-fill,minmax(var(--newt-expressions-preview-size),1fr))] gap-[var(--newt-space-1)]"
                      )}
                    >
                      {section.items.map((item) => {
                        const key = `${section.key}|${item.id}`
                        const value = expressionValue(item, tone)
                        const where =
                          categories.find(
                            (category) => category.id === item.category
                          )?.label ?? ""
                        return (
                          <button
                            key={key}
                            type="button"
                            data-cell
                            disabled={disabled || item.disabled}
                            tabIndex={key === tabKey ? 0 : -1}
                            aria-label={
                              item.disabled
                                ? `${item.label}, unavailable`
                                : item.label
                            }
                            aria-pressed={
                              current != null &&
                              (item.value === current ||
                                item.skins?.includes(current) === true)
                            }
                            onClick={() => select(item)}
                            onFocus={() => {
                              setActiveKey(key)
                              setHovered({ item, where })
                            }}
                            onMouseEnter={() => setHovered({ item, where })}
                            className={cn(
                              "flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent p-0 enabled:hover:bg-newt-bg-hover aria-pressed:bg-newt-bg-active aria-pressed:shadow-[inset_0_0_0_2px_var(--newt-brand)] disabled:cursor-not-allowed disabled:border-dashed disabled:border-newt-border disabled:opacity-50",
                              kind === "emoji"
                                ? "size-[var(--newt-expressions-target-size)]"
                                : "aspect-square w-full",
                              focusRing
                            )}
                          >
                            <ExpressionArt
                              item={item}
                              value={value}
                              large={kind !== "emoji"}
                            />
                          </button>
                        )
                      })}
                    </div>
                  ) : null}
                </section>
              ))}
              {sections.length === 0 ? (
                <div
                  role="status"
                  className="flex flex-col items-center px-[var(--newt-space-3)] py-[calc(var(--newt-space-3)*3)] text-center text-newt-text-secondary"
                >
                  <p className="m-0 font-semibold text-newt-text-primary">
                    {searching
                      ? "No expressions match your search."
                      : "Nothing here yet."}
                  </p>
                  <p className="m-0">
                    {searching
                      ? "Try another word or another tab."
                      : "Try another tab."}
                  </p>
                </div>
              ) : searching ? (
                <p role="status" className="sr-only">
                  {resultCount === 1 ? "1 result" : `${resultCount} results`}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex h-[calc(var(--newt-expressions-target-size)+var(--newt-space-2))] shrink-0 items-center gap-[var(--newt-space-2)] border-t border-newt-border bg-newt-bg-floating px-[var(--newt-space-3)]">
            {preview ? (
              <>
                <span
                  aria-hidden="true"
                  className="flex size-[calc(var(--newt-expressions-target-size)-var(--newt-space-2))] shrink-0 items-center justify-center overflow-hidden"
                >
                  {preview.item.src ? (
                    <img
                      src={preview.item.src}
                      alt=""
                      className="size-full object-contain"
                    />
                  ) : preview.item.kind === "emoji" ? (
                    <span className="text-[length:var(--newt-font-size-expression)] leading-none">
                      {expressionValue(preview.item, tone)}
                    </span>
                  ) : null}
                </span>
                <span className="min-w-0 truncate font-semibold">
                  {expressionShortcode(preview.item)}
                </span>
                <span className="ms-auto shrink-0 truncate ps-[var(--newt-space-2)] text-[length:var(--newt-font-size-xs)] text-newt-text-secondary">
                  {preview.where}
                </span>
              </>
            ) : (
              <span className="text-newt-text-secondary">
                Hover or focus an expression to preview it.
              </span>
            )}
          </div>
        </dialog>
      </div>
    )
  }
)
ExpressionsPicker.displayName = "ExpressionsPicker"
export { ExpressionsPicker }
