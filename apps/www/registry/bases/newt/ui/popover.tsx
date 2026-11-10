"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface PopoverContextValue {
  readonly open: boolean
  readonly setOpen: (open: boolean) => void
  /** Ties the trigger to the panel, and marks the root for outside presses. */
  readonly id: string
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopover(component: string): PopoverContextValue {
  const context = React.useContext(PopoverContext)
  if (context === null) {
    throw new Error(`<${component}> must be used inside a <Popover>.`)
  }
  return context
}

export interface PopoverProps extends React.ComponentProps<"div"> {
  /** Controlled state. Leave undefined to let the popover own it. */
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/*
 * A small panel that hangs off the button that opened it. The root is the
 * positioning context, so the panel follows its trigger without any
 * measuring. Escape and a press anywhere outside close it, and closing with
 * the keyboard hands focus back to the trigger.
 */
const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    { className, open, defaultOpen = false, onOpenChange, onKeyDown, ...props },
    ref
  ) => {
    const id = React.useId()
    const [internal, setInternal] = React.useState(defaultOpen)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internal

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternal(next)
        onOpenChange?.(next)
      },
      [isControlled, onOpenChange]
    )

    React.useEffect(() => {
      if (!isOpen) return
      const onPointerDown = (event: PointerEvent) => {
        const inside =
          event.target instanceof Element &&
          event.target.closest(`[data-popover="${id}"]`) !== null
        if (!inside) setOpen(false)
      }
      document.addEventListener("pointerdown", onPointerDown)
      return () => document.removeEventListener("pointerdown", onPointerDown)
    }, [isOpen, id, setOpen])

    const context = React.useMemo(
      () => ({ open: isOpen, setOpen, id }),
      [isOpen, setOpen, id]
    )

    return (
      <PopoverContext.Provider value={context}>
        {/* oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- Escape is caught as it bubbles from the trigger or the panel; the wrapper itself is never focused */}
        <div
          ref={ref}
          data-popover={id}
          data-state={isOpen ? "open" : "closed"}
          className={cn("relative inline-flex", className)}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (event.defaultPrevented || event.key !== "Escape" || !isOpen) {
              return
            }
            event.stopPropagation()
            setOpen(false)
            event.currentTarget
              .querySelector<HTMLElement>("[data-popover-trigger]")
              ?.focus()
          }}
          {...props}
        />
      </PopoverContext.Provider>
    )
  }
)
Popover.displayName = "Popover"

/*
 * A plain button that carries the state. It has no look of its own: pass the
 * classes of the button it should be, for example
 * `className={buttonVariants({ variant: "secondary" })}`.
 */
const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ onClick, type = "button", ...props }, ref) => {
  const popover = usePopover("PopoverTrigger")
  return (
    <button
      ref={ref}
      type={type}
      data-popover-trigger=""
      aria-expanded={popover.open}
      aria-controls={popover.open ? `${popover.id}-content` : undefined}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) popover.setOpen(!popover.open)
      }}
      {...props}
    />
  )
})
PopoverTrigger.displayName = "PopoverTrigger"

export interface PopoverContentProps extends React.ComponentProps<"div"> {
  /** Which side of the trigger the panel opens on. */
  side?: "bottom" | "top"
  /** Which edge of the trigger the panel lines up with. */
  align?: "start" | "center" | "end"
}

const SIDE = {
  bottom: "top-[calc(100%+8px)]",
  top: "bottom-[calc(100%+8px)]",
} as const

const ALIGN = {
  start: "start-0",
  center: "start-1/2 translate-x-[calc(var(--newt-dir)*-50%)]",
  end: "end-0",
} as const

const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ className, side = "bottom", align = "start", ...props }, ref) => {
    const popover = usePopover("PopoverContent")
    if (!popover.open) return null
    return (
      <div
        ref={ref}
        id={`${popover.id}-content`}
        role="dialog"
        data-side={side}
        data-align={align}
        className={cn(
          "absolute z-50 flex w-[280px] max-w-[90vw] flex-col items-start gap-2 rounded-md border border-newt-border bg-newt-bg-floating p-3 text-sm leading-5 text-newt-text-secondary shadow-elevation-high",
          SIDE[side],
          ALIGN[align],
          className
        )}
        {...props}
      />
    )
  }
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
