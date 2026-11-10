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
 * measuring. Escape and a press anywhere outside close it; if focus was
 * inside when Escape closed it, focus goes back to the trigger.
 */
const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  ({ className, open, defaultOpen = false, onOpenChange, ...props }, ref) => {
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

    /*
     * Both listeners sit on the document while the popover is open. Escape
     * has to work wherever focus is: some browsers do not focus a button on
     * click, and a click on the panel's text leaves focus on the body.
     */
    React.useEffect(() => {
      if (!isOpen) return
      const root = () => document.querySelector(`[data-popover="${id}"]`)
      const onPointerDown = (event: PointerEvent) => {
        const inside =
          event.target instanceof Node && root()?.contains(event.target)
        if (!inside) setOpen(false)
      }
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Escape" || event.defaultPrevented) return
        /* Handled here, so an enclosing dialog does not close as well. */
        event.preventDefault()
        const focusInside = root()?.contains(document.activeElement)
        setOpen(false)
        /* Focus goes back to the trigger only if it would otherwise be lost. */
        if (focusInside) {
          root()?.querySelector<HTMLElement>("[data-popover-trigger]")?.focus()
        }
      }
      document.addEventListener("pointerdown", onPointerDown)
      document.addEventListener("keydown", onKeyDown)
      return () => {
        document.removeEventListener("pointerdown", onPointerDown)
        document.removeEventListener("keydown", onKeyDown)
      }
    }, [isOpen, id, setOpen])

    const context = React.useMemo(
      () => ({ open: isOpen, setOpen, id }),
      [isOpen, setOpen, id]
    )

    return (
      <PopoverContext.Provider value={context}>
        <div
          ref={ref}
          data-popover={id}
          data-state={isOpen ? "open" : "closed"}
          className={cn("relative inline-flex", className)}
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
