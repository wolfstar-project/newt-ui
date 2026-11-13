"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/** One row of the palette. */
export interface CommandItem {
  /** Unique across the whole palette; handed back by `onSelect`. */
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

export interface CommandPaletteProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  "onSelect" | "children"
> {
  /** Whether the palette is shown. */
  open?: boolean
  /** Called with `false` on Escape, a press of the overlay or a selection. */
  onOpenChange?: (open: boolean) => void
  groups: readonly CommandGroup[]
  /** Called with the chosen row; the palette then closes itself. */
  onSelect?: (item: CommandItem) => void
  /** Accessible name of the dialog. */
  label?: string
  placeholder?: string
  /** Shown when the query matches nothing. */
  emptyText?: string
  /** The footer's wording. Pass `false` to leave the footer out. */
  hints?: CommandPaletteHints | false
  /**
   * The element the overlay and panel are portalled into. Defaults to
   * `document.body`. A palette opened below a `DirectionProvider` or a themed
   * wrapper passes that element, so it keeps the direction and the palette.
   */
  container?: React.ComponentProps<typeof DialogPrimitive.Portal>["container"]
}

const defaultHints: CommandPaletteHints = {
  move: "to move",
  select: "to select",
  close: "to close",
}

const kbdClassName =
  "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-newt-border bg-newt-bg-base px-1.5 font-mono text-[11px] font-semibold text-newt-text-secondary"

function matches(item: CommandItem, query: string): boolean {
  if (query === "") return true
  return [item.label, item.description ?? "", ...(item.keywords ?? [])].some(
    (text) => text.toLowerCase().includes(query)
  )
}

/*
 * A search box over a list of places to go and things to do. The shell is a
 * Radix Dialog, which owns the focus trap, Escape and outside press, scroll
 * lock, and hiding the page from screen readers. Focus never leaves the
 * input: the arrow keys move a highlight through the list, and
 * `aria-activedescendant` tells a screen reader which row that is.
 */
const CommandPalette = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  CommandPaletteProps
>(
  (
    {
      className,
      open = false,
      onOpenChange,
      groups,
      onSelect,
      label = "Command palette",
      placeholder = "Where would you like to go?",
      emptyText = "Nothing matches that.",
      hints = defaultHints,
      container,
      onOpenAutoFocus,
      onCloseAutoFocus,
      onEscapeKeyDown,
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const [query, setQuery] = React.useState("")
    const [active, setActive] = React.useState(0)
    const close = React.useCallback(() => onOpenChange?.(false), [onOpenChange])
    /* The element that had focus before the palette opened. */
    const previousFocus = React.useRef<Element | null>(null)

    /* Every opening starts from an empty query. */
    const [wasOpen, setWasOpen] = React.useState(open)
    if (open !== wasOpen) {
      setWasOpen(open)
      if (open) {
        setQuery("")
        setActive(0)
      }
    }

    const needle = query.trim().toLowerCase()
    const shown = groups
      .map((group) => ({
        label: group.label,
        items: group.items.filter((item) => matches(item, needle)),
      }))
      .filter((group) => group.items.length > 0)
    const flat = shown.flatMap((group) => group.items)
    const current = flat[Math.min(active, flat.length - 1)]
    const optionId = (item: CommandItem) => `${id}-${item.id}`

    /*
     * The highlighted row is scrolled into view only when the keyboard moved
     * it. The pointer moves the highlight too, and scrolling then would slide
     * the list under the pointer and make it jitter.
     */
    const scrollToCurrent = React.useRef(false)
    React.useEffect(() => {
      if (!scrollToCurrent.current || current === undefined) return
      scrollToCurrent.current = false
      document
        .getElementById(`${id}-${current.id}`)
        ?.scrollIntoView({ block: "nearest" })
    }, [current, id])

    const choose = (item: CommandItem) => {
      onSelect?.(item)
      close()
    }

    return (
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal container={container}>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-newt-overlay" />
          <DialogPrimitive.Content
            ref={ref}
            aria-describedby={undefined}
            className={cn(
              "fixed inset-x-0 top-[15vh] z-[100] mx-auto flex max-h-[70vh] w-[560px] max-w-[92vw] flex-col overflow-hidden rounded-lg border border-newt-border bg-newt-bg-elevated text-newt-text-primary shadow-elevation-high outline-none",
              className
            )}
            onOpenAutoFocus={(event) => {
              // Save it first: the handler can move focus into the palette.
              previousFocus.current = document.activeElement
              onOpenAutoFocus?.(event)
            }}
            onCloseAutoFocus={(event) => {
              onCloseAutoFocus?.(event)
              if (event.defaultPrevented) return
              /*
               * The palette has no trigger for Radix to give focus back to,
               * so it returns to the element that had it.
               */
              event.preventDefault()
              if (previousFocus.current instanceof HTMLElement) {
                previousFocus.current.focus()
              }
            }}
            onEscapeKeyDown={(event) => {
              onEscapeKeyDown?.(event)
              /* While an input method composes, Escape cancels its candidate. */
              if (event.isComposing) event.preventDefault()
            }}
            {...props}
          >
            <DialogPrimitive.Title className="sr-only">
              {label}
            </DialogPrimitive.Title>
            <input
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={`${id}-list`}
              aria-activedescendant={
                current === undefined ? undefined : optionId(current)
              }
              aria-autocomplete="list"
              aria-label={placeholder}
              placeholder={placeholder}
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActive(0)
              }}
              onKeyDown={(event) => {
                /* While an input method composes, Enter confirms a candidate. */
                if (event.nativeEvent.isComposing) return
                if (event.key === "Enter") {
                  event.preventDefault()
                  if (current !== undefined) choose(current)
                } else if (event.key === "ArrowDown" && flat.length > 0) {
                  event.preventDefault()
                  scrollToCurrent.current = true
                  setActive(
                    (flat.indexOf(current ?? flat[0]) + 1) % flat.length
                  )
                } else if (event.key === "ArrowUp" && flat.length > 0) {
                  event.preventDefault()
                  scrollToCurrent.current = true
                  setActive(
                    (flat.indexOf(current ?? flat[0]) - 1 + flat.length) %
                      flat.length
                  )
                }
              }}
              className="mx-3 mt-3 rounded-sm border border-newt-border bg-newt-bg-input px-3.5 py-3 font-sans text-base text-newt-text-primary placeholder:text-newt-text-muted focus:border-newt-brand focus:outline-none"
            />
            <div
              id={`${id}-list`}
              role="listbox"
              aria-label={label}
              className="flex-1 overflow-y-auto px-3 pb-3 pt-2"
            >
              {shown.map((group) => (
                <div key={group.label} role="group" aria-label={group.label}>
                  <div
                    aria-hidden="true"
                    className="px-2 pb-1 pt-2.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted"
                  >
                    {group.label}
                  </div>
                  {group.items.map((item) => {
                    const selected = item === current
                    return (
                      // oxlint-disable-next-line jsx-a11y/click-events-have-key-events -- options are driven from the input through aria-activedescendant; Enter there selects the highlighted one
                      <div
                        key={item.id}
                        id={optionId(item)}
                        role="option"
                        tabIndex={-1}
                        aria-selected={selected}
                        onClick={() => choose(item)}
                        onPointerMove={() => setActive(flat.indexOf(item))}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-sm p-2 text-[15px] leading-5",
                          selected
                            ? "bg-newt-bg-active text-newt-text-primary"
                            : "text-newt-text-secondary"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="w-5 shrink-0 text-center font-semibold text-newt-text-muted"
                        >
                          {item.prefix}
                        </span>
                        <span className="truncate font-medium">
                          {item.label}
                        </span>
                        {item.description === undefined ? null : (
                          <span className="truncate text-[13px] text-newt-text-muted">
                            {item.description}
                          </span>
                        )}
                        {item.shortcut === undefined ? null : (
                          <kbd className={cn(kbdClassName, "ms-auto shrink-0")}>
                            {item.shortcut}
                          </kbd>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
              {flat.length === 0 ? (
                <p className="m-0 px-2 py-6 text-center text-sm text-newt-text-muted">
                  {emptyText}
                </p>
              ) : null}
            </div>
            {hints === false ? null : (
              <footer
                aria-hidden="true"
                className="flex flex-wrap gap-x-4 gap-y-1 border-t border-newt-border bg-newt-bg-surface px-4 py-2.5 text-xs text-newt-text-muted"
              >
                <span className="inline-flex items-center gap-1">
                  <kbd className={kbdClassName}>↑</kbd>
                  <kbd className={kbdClassName}>↓</kbd>
                  {hints.move}
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className={kbdClassName}>Enter</kbd>
                  {hints.select}
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className={kbdClassName}>Esc</kbd>
                  {hints.close}
                </span>
              </footer>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    )
  }
)
CommandPalette.displayName = "CommandPalette"

export { CommandPalette }
