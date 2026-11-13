"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A panel that comes in from the edge and keeps the page behind it in view.
 * Radix owns the behaviour: open state, the focus trap, Escape and outside
 * press, scroll lock, hiding the page from screen readers, and giving focus
 * back to the trigger. Only the look is newt/ui's.
 */
const Drawer = DialogPrimitive.Root

/*
 * It has no look of its own. Pass `asChild` to put the state on your own
 * button: `<DrawerTrigger asChild><Button>Open</Button></DrawerTrigger>`.
 * Focus returns to the trigger when the drawer closes. A drawer opened from
 * state alone has no trigger, so pass `onCloseAutoFocus` to `DrawerContent`
 * to say where focus goes.
 */
const DrawerTrigger = DialogPrimitive.Trigger

/**
 * Closes the drawer when activated. Wrap a Button with `asChild` to keep its styling:
 * `<DrawerClose asChild><Button variant="secondary">Cancel</Button></DrawerClose>`
 */
const DrawerClose = DialogPrimitive.Close

const SIDE = {
  end: "inset-y-0 end-0 start-auto h-full w-[380px] max-w-[90vw] border-s",
  start: "inset-y-0 start-0 end-auto h-full w-[380px] max-w-[90vw] border-e",
  bottom:
    "inset-x-0 bottom-0 top-auto h-auto max-h-[85vh] w-full max-w-none border-t",
} as const

const DrawerContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /** The edge it sits against. `end` is the right in left-to-right text. */
    side?: keyof typeof SIDE
    /**
     * The element the overlay and panel are portalled into. Defaults to
     * `document.body`. A drawer opened below a `DirectionProvider` or a themed
     * wrapper passes that element, so it keeps the direction and the palette.
     */
    container?: React.ComponentProps<typeof DialogPrimitive.Portal>["container"]
  }
>(({ className, children, side = "end", container, ...props }, ref) => (
  <DialogPrimitive.Portal container={container}>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-newt-overlay" />
    <DialogPrimitive.Content
      ref={ref}
      data-side={side}
      className={cn(
        "fixed z-[100] flex flex-col border-newt-border bg-newt-bg-elevated text-newt-text-primary shadow-elevation-high outline-none",
        SIDE[side],
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
DrawerContent.displayName = "DrawerContent"

export interface DrawerHeaderProps extends React.ComponentProps<"header"> {
  /** Accessible name of the close button. */
  closeLabel?: string
}

/** The row for `DrawerTitle`, with the button that closes the drawer at its end. */
const DrawerHeader = React.forwardRef<HTMLElement, DrawerHeaderProps>(
  ({ className, closeLabel = "Close", children, ...props }, ref) => (
    <header
      ref={ref}
      className={cn(
        "flex items-center justify-between gap-3 border-b border-newt-border p-4",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
      <DialogPrimitive.Close
        aria-label={closeLabel}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm text-newt-text-muted hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
          <path
            fill="currentColor"
            d="M4.3 4.3a1 1 0 0 1 1.4 0L8 6.6l2.3-2.3a1 1 0 1 1 1.4 1.4L9.4 8l2.3 2.3a1 1 0 0 1-1.4 1.4L8 9.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L6.6 8 4.3 5.7a1 1 0 0 1 0-1.4Z"
          />
        </svg>
      </DialogPrimitive.Close>
    </header>
  )
)
DrawerHeader.displayName = "DrawerHeader"

/** The dialog's accessible name. Give it real text. */
const DrawerTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("m-0 text-base font-semibold leading-5", className)}
    {...props}
  />
))
DrawerTitle.displayName = "DrawerTitle"

/**
 * Radix links it to the dialog with `aria-describedby`. A drawer without one
 * passes `aria-describedby={undefined}` to `DrawerContent` to say so.
 */
const DrawerDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("m-0 text-sm leading-5 text-newt-text-secondary", className)}
    {...props}
  />
))
DrawerDescription.displayName = "DrawerDescription"

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

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
}
