"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface DrawerContextValue {
  readonly close: () => void
  readonly titleId: string
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)

function useDrawer(component: string): DrawerContextValue {
  const context = React.useContext(DrawerContext)
  if (context === null) {
    throw new Error(`<${component}> must be used inside a <Drawer>.`)
  }
  return context
}

export interface DrawerProps extends Omit<
  React.ComponentProps<"dialog">,
  "open"
> {
  /** Whether the drawer is shown. */
  open?: boolean
  /** Called with `false` on Escape, a press of the backdrop or a close control. */
  onOpenChange?: (open: boolean) => void
  /** The edge it sits against. `end` is the right in left-to-right text. */
  side?: "end" | "start" | "bottom"
}

const SIDE = {
  end: "inset-y-0 end-0 start-auto h-full w-[380px] max-w-[90vw] border-s",
  start: "inset-y-0 start-0 end-auto h-full w-[380px] max-w-[90vw] border-e",
  bottom:
    "inset-x-0 bottom-0 top-auto h-auto max-h-[85vh] w-full max-w-none border-t",
} as const

/*
 * A panel that comes in from the edge and keeps the page behind it in view.
 * It is a native `<dialog>` opened with `showModal()`: it sits in the top
 * layer, holds focus inside itself, makes the page behind it inert and
 * answers Escape, with no focus-trap code of its own.
 */
const Drawer = React.forwardRef<HTMLDialogElement | null, DrawerProps>(
  (
    {
      className,
      open = false,
      onOpenChange,
      side = "end",
      onClick,
      onCancel,
      onClose,
      children,
      ...props
    },
    ref
  ) => {
    const dialog = React.useRef<HTMLDialogElement | null>(null)
    React.useImperativeHandle<
      HTMLDialogElement | null,
      HTMLDialogElement | null
    >(ref, () => dialog.current)
    const titleId = React.useId()
    const close = React.useCallback(() => onOpenChange?.(false), [onOpenChange])

    React.useEffect(() => {
      const element = dialog.current
      if (element === null) return
      if (open && !element.open) element.showModal()
      else if (!open && element.open) element.close()
    }, [open])

    const context = React.useMemo(() => ({ close, titleId }), [close, titleId])

    return (
      <DrawerContext.Provider value={context}>
        {/* oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- a press on the backdrop is a pointer shortcut for Escape, which the dialog already handles */}
        <dialog
          ref={dialog}
          aria-labelledby={titleId}
          data-side={side}
          className={cn(
            "fixed m-0 max-h-none flex-col border-newt-border bg-newt-bg-elevated p-0 text-newt-text-primary shadow-elevation-high backdrop:bg-black/60 open:flex",
            SIDE[side],
            className
          )}
          onClick={(event) => {
            onClick?.(event)
            /* The dialog's own box, outside its content, is the backdrop. */
            if (event.target === event.currentTarget) close()
          }}
          onCancel={(event) => {
            onCancel?.(event)
            /* Escape asks; the `open` prop answers. */
            event.preventDefault()
            close()
          }}
          onClose={(event) => {
            onClose?.(event)
            if (open) close()
          }}
          {...props}
        >
          {children}
        </dialog>
      </DrawerContext.Provider>
    )
  }
)
Drawer.displayName = "Drawer"

export interface DrawerHeaderProps extends React.ComponentProps<"header"> {
  /** Accessible name of the close button. */
  closeLabel?: string
}

/** The title, which names the dialog, and the button that closes it. */
const DrawerHeader = React.forwardRef<HTMLElement, DrawerHeaderProps>(
  ({ className, closeLabel = "Close", children, ...props }, ref) => {
    const { close, titleId } = useDrawer("DrawerHeader")
    return (
      <header
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-3 border-b border-newt-border p-4",
          className
        )}
        {...props}
      >
        <h2 id={titleId} className="m-0 text-base font-semibold leading-5">
          {children}
        </h2>
        <button
          type="button"
          aria-label={closeLabel}
          onClick={close}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-newt-text-muted hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
            <path
              fill="currentColor"
              d="M4.3 4.3a1 1 0 0 1 1.4 0L8 6.6l2.3-2.3a1 1 0 1 1 1.4 1.4L9.4 8l2.3 2.3a1 1 0 0 1-1.4 1.4L8 9.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L6.6 8 4.3 5.7a1 1 0 0 1 0-1.4Z"
            />
          </svg>
        </button>
      </header>
    )
  }
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex-1 overflow-y-auto p-4 text-sm leading-5 text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
DrawerBody.displayName = "DrawerBody"

const DrawerFooter = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"footer">
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn("flex justify-end gap-2 bg-newt-bg-surface p-4", className)}
    {...props}
  />
))
DrawerFooter.displayName = "DrawerFooter"

/*
 * A plain button that closes the drawer. Like the popover's trigger it has no
 * look of its own; give it the classes of the button it should be.
 */
const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ onClick, type = "button", ...props }, ref) => {
  const { close } = useDrawer("DrawerClose")
  return (
    <button
      ref={ref}
      type={type}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) close()
      }}
      {...props}
    />
  )
})
DrawerClose.displayName = "DrawerClose"

export { Drawer, DrawerHeader, DrawerBody, DrawerFooter, DrawerClose }
