"use client"

import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/utils"

export interface SelectMenuOption {
  value: string
  label: string
  /** Secondary line under the label. */
  description?: string
  disabled?: boolean
}

export interface SelectMenuProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSelect" | "defaultValue"
> {
  options: readonly SelectMenuOption[]
  /** Controlled selection. Leave undefined to let the menu own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  /** Accessible name of the trigger and the listbox. */
  label?: string
}

/** Panel geometry, measured from the trigger each time the menu opens. */
interface PanelBox {
  left: number
  width: number
  top?: number
  bottom?: number
}

const SelectMenu = React.forwardRef<HTMLDivElement, SelectMenuProps>(
  (
    {
      className,
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Make a selection",
      disabled = false,
      label = "Select an option",
      ...props
    },
    ref
  ) => {
    const id = React.useId()
    const listboxId = `${id}-listbox`
    const optionId = (index: number) => `${id}-option-${index}`

    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)

    const [open, setOpen] = React.useState(false)
    const [active, setActive] = React.useState(-1)
    const [box, setBox] = React.useState<PanelBox | null>(null)
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const selected = value ?? uncontrolled

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
     * and flipped above the trigger when the space below runs out.
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
      const current = options.findIndex((option) => option.value === selected)
      setActive(
        current >= 0 && selectable(current) ? current : firstSelectable()
      )
    }

    const closeMenu = () => {
      setOpen(false)
      setActive(-1)
    }

    const select = (index: number) => {
      const option = options[index]
      if (!option || option.disabled) return
      if (value === undefined) setUncontrolled(option.value)
      onValueChange?.(option.value)
      closeMenu()
      triggerRef.current?.focus()
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
        case " ":
          event.preventDefault()
          if (open) select(active)
          else openMenu()
          return
        case "Escape":
          if (!open) return
          event.preventDefault()
          closeMenu()
      }
    }

    const selectedOption = options.find((option) => option.value === selected)

    const panel =
      open && box ? (
        <div
          ref={panelRef}
          style={{
            position: "fixed",
            left: box.left,
            width: box.width,
            top: box.top,
            bottom: box.bottom,
            zIndex: 1002,
          }}
          /* Keep focus on the trigger: aria-activedescendant drives the list. */
          onMouseDown={(event) => event.preventDefault()}
          className="rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high"
        >
          <ul
            id={listboxId}
            role="listbox"
            aria-label={label}
            className="m-0 max-h-80 list-none overflow-y-auto p-0"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={option.value === selected}
                aria-disabled={option.disabled || undefined}
                onMouseEnter={() => {
                  if (!option.disabled) setActive(index)
                }}
                onClick={() => select(index)}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-newt-text-secondary",
                  index === active &&
                    !option.disabled &&
                    "bg-newt-brand text-white",
                  option.value === selected &&
                    "text-newt-text-primary after:ml-auto after:font-bold after:text-newt-brand after:content-['\\2713']",
                  option.value === selected &&
                    index === active &&
                    "after:text-white",
                  option.disabled &&
                    "cursor-not-allowed bg-transparent text-newt-text-muted opacity-50"
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate">{option.label}</span>
                  {option.description ? (
                    <span
                      className={cn(
                        "truncate text-xs text-newt-text-muted",
                        index === active && !option.disabled && "text-white"
                      )}
                    >
                      {option.description}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null

    return (
      <div
        ref={ref}
        className={cn("relative w-full max-w-[400px]", className)}
        {...props}
      >
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            open && active >= 0 ? optionId(active) : undefined
          }
          aria-label={label}
          disabled={disabled}
          onClick={() => (open ? closeMenu() : openMenu())}
          onKeyDown={onKeyDown}
          className="flex min-h-9 w-full cursor-pointer items-center justify-between gap-2 rounded-sm border border-newt-border bg-newt-bg-input px-2 font-sans text-sm font-medium text-newt-text-primary hover:border-newt-bg-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span
            className={cn(
              "truncate",
              !selectedOption && "text-newt-text-muted"
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
          {/* Points down when closed, flips when the listbox opens. */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            className={cn("h-[18px] w-[18px] shrink-0", open && "rotate-180")}
          >
            <path
              fill="currentColor"
              d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z"
            />
          </svg>
        </button>
        {panel ? createPortal(panel, document.body) : null}
      </div>
    )
  }
)
SelectMenu.displayName = "SelectMenu"

export { SelectMenu }
