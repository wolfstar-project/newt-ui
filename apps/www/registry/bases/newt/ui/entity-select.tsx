"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

/*
 * The picker for things the server already knows about: its members, its
 * roles, its channels, or all of them at once.
 *
 * It is a separate control from the string select rather than a mode of it,
 * because the rows are not strings. A member arrives with a face, a role with
 * a colour and a headcount, a channel with the glyph that says what kind of
 * channel it is — and when more than one can be chosen, the choices come back
 * out of the list and sit in the control as chips, which a string select
 * never does.
 */

/** What the list is drawn from. Mentionable mixes members and roles. */
export type EntityKind = "user" | "role" | "channel" | "mentionable"

export interface EntityOption {
  value: string
  label: string
  /** A member's avatar, or the glyph a role or channel is known by. */
  icon?: React.ReactNode
  /** Members carrying this role — shown beside the name, as the client does. */
  count?: number
  /** A short tag after the name. An app is the one that always has one. */
  badge?: string
  /** A role's colour, which its name takes in the list and in its chip. */
  color?: string
  disabled?: boolean
}

/**
 * What one of these may carry. The platform takes at most this many either
 * way — as the list it offers, and as the selection it accepts back.
 */
export const ENTITY_SELECT_MAX = 25

export interface EntitySelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "defaultValue"
> {
  options: readonly EntityOption[]
  /** Which of the four this is. Only the empty-list wording depends on it. */
  kind?: EntityKind
  /** Controlled selection. Leave undefined to let the control own it. */
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: readonly string[]) => void
  /** How many may be chosen. More than one turns the control into chips. */
  max?: number
  placeholder?: string
  disabled?: boolean
  /** Accessible name of the trigger and the listbox. */
  label?: string
}

/** Panel geometry, measured from the control each time the list opens. */
interface PanelBox {
  left: number
  width: number
  top?: number
  bottom?: number
}

const EMPTY = {
  user: "No members to show",
  role: "No roles to show",
  channel: "No channels to show",
  mentionable: "Nothing to show",
} as const satisfies Record<EntityKind, string>

/** The headcount beside a role, which is a number and the glyph for people. */
function Headcount({ count }: { readonly count: number }) {
  return (
    <span className="flex shrink-0 items-center gap-1 text-xs tabular-nums text-newt-text-muted">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
        <path
          fill="currentColor"
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.9 0-7 2-7 4.5V20h14v-1.5c0-2.5-3.1-4.5-7-4.5Z"
        />
      </svg>
      {count}
    </span>
  )
}

const EntitySelect = React.forwardRef<HTMLDivElement, EntitySelectProps>(
  (
    {
      className,
      options: given,
      kind = "user",
      value,
      defaultValue = [],
      onValueChange,
      max = 1,
      placeholder = "Make a selection",
      disabled = false,
      label = "Select an option",
      ...props
    },
    ref
  ) => {
    /* The cap is applied here: the keyboard and the option ids count rows, and
     * a row the platform would reject should not be one of them. */
    const options = React.useMemo(
      () => given.slice(0, ENTITY_SELECT_MAX),
      [given]
    )
    const limit = Math.min(max, ENTITY_SELECT_MAX)
    const multiple = limit > 1

    const id = React.useId()
    const listboxId = `${id}-listbox`
    const optionId = (index: number) => `${id}-option-${index}`

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)

    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState(-1)
    const [box, setBox] = React.useState<PanelBox | null>(null)
    const [uncontrolled, setUncontrolled] =
      React.useState<readonly string[]>(defaultValue)
    const selected = value ?? uncontrolled

    const chosen = React.useMemo(
      () => options.filter((option) => selected.includes(option.value)),
      [options, selected]
    )

    const commit = React.useCallback(
      (next: readonly string[]) => {
        if (value === undefined) setUncontrolled(next)
        onValueChange?.(next)
      },
      [value, onValueChange]
    )

    const selectable = React.useCallback(
      (index: number) => Boolean(options[index]) && !options[index].disabled,
      [options]
    )

    const firstSelectable = React.useCallback(
      () => options.findIndex((option) => !option.disabled),
      [options]
    )

    const lastSelectable = React.useCallback(() => {
      for (let i = options.length - 1; i >= 0; i--) {
        if (!options[i].disabled) return i
      }
      return -1
    }, [options])

    const step = React.useCallback(
      (from: number, direction: 1 | -1) => {
        const count = options.length
        for (let i = 1; i <= count; i++) {
          const index = (from + direction * i + count * i) % count
          if (selectable(index)) return index
        }
        return from
      },
      [options.length, selectable]
    )

    /*
     * The panel is portalled to the body so an `overflow: hidden` ancestor
     * cannot clip it, which means it is positioned from measured coordinates
     * and flipped above the control when the space below runs out.
     */
    const measure = React.useCallback(() => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const below = window.innerHeight - rect.bottom
      const height = panelRef.current?.offsetHeight ?? 0
      setBox(
        height > below && rect.top > below
          ? {
              left: rect.left,
              width: rect.width,
              bottom: window.innerHeight - rect.top + 4,
            }
          : { left: rect.left, width: rect.width, top: rect.bottom + 4 }
      )
    }, [])

    React.useLayoutEffect(() => {
      if (!open) return
      measure()
    }, [open, measure])

    React.useEffect(() => {
      if (!open) return
      const update = () => measure()
      /* Capture phase: a nested scroller never fires a window scroll event. */
      document.addEventListener("scroll", update, {
        capture: true,
        passive: true,
      })
      window.addEventListener("resize", update)
      return () => {
        document.removeEventListener("scroll", update, { capture: true })
        window.removeEventListener("resize", update)
      }
    }, [open, measure])

    React.useEffect(() => {
      if (!open) return
      const onPointerDown = (event: MouseEvent) => {
        const target = event.target
        if (!(target instanceof Node)) return
        if (
          triggerRef.current?.contains(target) ||
          panelRef.current?.contains(target)
        ) {
          return
        }
        setOpen(false)
      }
      document.addEventListener("mousedown", onPointerDown)
      return () => document.removeEventListener("mousedown", onPointerDown)
    }, [open])

    React.useEffect(() => {
      if (active < 0) return
      panelRef.current
        ?.querySelector(`#${CSS.escape(optionId(active))}`)
        ?.scrollIntoView({ block: "nearest" })
      // eslint-disable-next-line react-hooks/exhaustive-deps -- optionId is derived from a stable id
    }, [active])

    const openMenu = () => {
      if (disabled || open) return
      setOpen(true)
      const current = options.findIndex((option) =>
        selected.includes(option.value)
      )
      setActive(
        current >= 0 && selectable(current) ? current : firstSelectable()
      )
    }

    const closeMenu = () => {
      setOpen(false)
      setActive(-1)
    }

    const toggle = (index: number) => {
      const option = options[index]
      if (!option || option.disabled) return
      if (!multiple) {
        commit([option.value])
        closeMenu()
        triggerRef.current?.focus()
        return
      }
      /*
       * At the limit the list stays open and stops taking more, rather than
       * silently dropping the oldest choice: the reader picked those, and a
       * control that quietly un-picks one is a control that lies.
       */
      const already = selected.includes(option.value)
      if (!already && selected.length >= limit) return
      commit(
        already
          ? selected.filter((each) => each !== option.value)
          : [...selected, option.value]
      )
    }

    const remove = (entity: string) => {
      commit(selected.filter((each) => each !== entity))
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp": {
          event.preventDefault()
          if (!open) {
            openMenu()
            return
          }
          setActive((current) =>
            step(current, event.key === "ArrowDown" ? 1 : -1)
          )
          return
        }
        case "Home":
          if (!open) return
          event.preventDefault()
          setActive(firstSelectable())
          return
        case "End":
          if (!open) return
          event.preventDefault()
          setActive(lastSelectable())
          return
        case "Enter":
        case " ": {
          event.preventDefault()
          if (!open) {
            openMenu()
            return
          }
          if (active >= 0) toggle(active)
          return
        }
        case "Escape":
          if (!open) return
          event.preventDefault()
          closeMenu()
          triggerRef.current?.focus()
          return
        case "Backspace": {
          /* The chip nearest the caret goes first, which is the last one. */
          if (!multiple || open || chosen.length === 0) return
          event.preventDefault()
          const last = chosen[chosen.length - 1]
          if (last) remove(last.value)
          return
        }
        default:
      }
    }

    return (
      <div
        ref={ref}
        className={cn("w-full max-w-[420px]", className)}
        {...props}
      >
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={
            open && active >= 0 ? optionId(active) : undefined
          }
          aria-label={label}
          disabled={disabled}
          onClick={() => (open ? closeMenu() : openMenu())}
          onKeyDown={onKeyDown}
          className={cn(
            "flex w-full items-center gap-2 rounded-md border border-newt-border bg-newt-bg-base px-3 py-2 text-start text-sm text-newt-text-secondary",
            "transition-colors duration-fast ease-newt hover:border-newt-text-muted",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
            open && "border-newt-text-link",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {chosen.length === 0 ? (
              <span className="text-newt-text-muted">{placeholder}</span>
            ) : multiple ? (
              chosen.map((option) => (
                /*
                 * A chip is not a button: it sits inside one, and nesting two
                 * would be markup a keyboard cannot untangle. Its cross is
                 * decorative, and Backspace is the way in from the keyboard.
                 */
                <span
                  key={option.value}
                  onMouseDown={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    remove(option.value)
                  }}
                  className="flex items-center gap-1.5 rounded-sm bg-newt-bg-elevated px-1.5 py-1 text-xs text-newt-text-primary"
                >
                  {option.icon ? (
                    <span aria-hidden="true" className="flex h-4 w-4 shrink-0">
                      {option.icon}
                    </span>
                  ) : null}
                  <span
                    style={option.color ? { color: option.color } : undefined}
                  >
                    {option.label}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3 w-3"
                  >
                    <path
                      fill="currentColor"
                      d="M7.05 5.64a1 1 0 0 1 1.41 0L12 9.17l3.54-3.53a1 1 0 1 1 1.41 1.41L13.41 10.6l3.54 3.53a1 1 0 0 1-1.41 1.42L12 12.01l-3.54 3.54a1 1 0 0 1-1.41-1.42l3.53-3.53-3.53-3.54a1 1 0 0 1 0-1.42Z"
                    />
                  </svg>
                </span>
              ))
            ) : (
              <span className="flex min-w-0 items-center gap-2">
                {chosen[0]?.icon ? (
                  <span aria-hidden="true" className="flex h-5 w-5 shrink-0">
                    {chosen[0].icon}
                  </span>
                ) : null}
                <span
                  className="truncate text-newt-text-primary"
                  style={
                    chosen[0]?.color ? { color: chosen[0].color } : undefined
                  }
                >
                  {chosen[0]?.label}
                </span>
              </span>
            )}
          </span>

          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={cn("h-[18px] w-[18px] shrink-0", open && "rotate-180")}
          >
            <path
              fill="currentColor"
              d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
            />
          </svg>
        </button>

        {/* The panel exists only once it is opened, which is only ever after
         * hydration — so reaching for `document` here is safe on a server
         * render, where `open` has never been true. */}
        {open
          ? createPortal(
              <div
                ref={panelRef}
                /*
                 * `fixed` from the first frame, before there is anything to be
                 * fixed at: a panel that started in the document flow would
                 * sit at the end of the body, and scrolling its first row into
                 * view would drag the whole page down to it. Hidden until
                 * measured, so that frame is never seen.
                 */
                style={{
                  position: "fixed",
                  visibility: box === null ? "hidden" : undefined,
                  left: box?.left,
                  width: box?.width,
                  top: box?.top,
                  bottom: box?.bottom,
                  zIndex: 1002,
                }}
                /* Keep focus on the control: aria-activedescendant drives the
                 * list, so the panel must never take it. */
                onMouseDown={(event) => event.preventDefault()}
                className="rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high"
              >
                <ul
                  id={listboxId}
                  role="listbox"
                  aria-label={label}
                  aria-multiselectable={multiple || undefined}
                  /*
                   * The scrollbar shows rather than hiding until the pointer
                   * moves: the list is capped at 25, so the bar is what says
                   * there is more of it below the fold.
                   */
                  className={cn(
                    "m-0 max-h-[300px] list-none overflow-y-auto p-0",
                    "[scrollbar-width:thin] [scrollbar-color:var(--newt-bg-active)_transparent]",
                    "[&::-webkit-scrollbar]:w-2",
                    "[&::-webkit-scrollbar-track]:bg-transparent",
                    "[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-newt-bg-active [&::-webkit-scrollbar-thumb]:bg-clip-padding",
                    "[&::-webkit-scrollbar-thumb:hover]:bg-newt-text-muted [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding"
                  )}
                >
                  {options.length === 0 ? (
                    <li className="px-2.5 py-2 text-sm text-newt-text-muted">
                      {EMPTY[kind]}
                    </li>
                  ) : (
                    options.map((option, index) => {
                      const picked = selected.includes(option.value)
                      const highlighted = index === active && !option.disabled
                      return (
                        <li
                          key={option.value}
                          id={optionId(index)}
                          role="option"
                          aria-selected={picked}
                          aria-disabled={option.disabled || undefined}
                          onMouseEnter={() => {
                            if (!option.disabled) setActive(index)
                          }}
                          onClick={() => toggle(index)}
                          className={cn(
                            "flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-newt-text-secondary",
                            highlighted && "bg-newt-bg-elevated",
                            picked && "text-newt-text-primary",
                            option.disabled &&
                              "cursor-not-allowed bg-transparent text-newt-text-muted opacity-50"
                          )}
                        >
                          {option.icon ? (
                            <span
                              aria-hidden="true"
                              className="flex h-6 w-6 shrink-0 items-center justify-center"
                            >
                              {option.icon}
                            </span>
                          ) : null}

                          <span
                            className="min-w-0 flex-1 truncate font-medium"
                            style={
                              option.color ? { color: option.color } : undefined
                            }
                          >
                            {option.label}
                          </span>

                          {option.count === undefined ? null : (
                            <Headcount count={option.count} />
                          )}

                          {option.badge === undefined ? null : (
                            <span className="shrink-0 rounded-sm bg-newt-brand px-1 py-0.5 text-[10px] font-bold uppercase leading-none text-white">
                              {option.badge}
                            </span>
                          )}

                          {/*
                           * A box rather than a tick, and only when more than
                           * one may be chosen: the shape says whether picking
                           * this one un-picks the last.
                           */}
                          {multiple ? (
                            <span
                              aria-hidden="true"
                              data-checked={picked || undefined}
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-newt-text-muted",
                                "data-[checked]:border-newt-brand data-[checked]:bg-newt-brand"
                              )}
                            >
                              {picked ? (
                                <svg
                                  viewBox="0 0 16 16"
                                  className="h-3.5 w-3.5"
                                >
                                  <path
                                    fill="#fff"
                                    d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
                                  />
                                </svg>
                              ) : null}
                            </span>
                          ) : null}
                        </li>
                      )
                    })
                  )}
                </ul>
              </div>,
              document.body
            )
          : null}
      </div>
    )
  }
)
EntitySelect.displayName = "EntitySelect"

export { EntitySelect }
