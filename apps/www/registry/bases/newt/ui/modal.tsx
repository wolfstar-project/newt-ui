"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Radix owns the behaviour: open state, the focus trap, Escape and outside
 * press, scroll lock, hiding the page from screen readers, and giving focus
 * back to the trigger. Only the look is newt/ui's.
 */
const Modal = DialogPrimitive.Root

/*
 * It has no look of its own. Pass `asChild` to put the state on your own
 * button: `<ModalTrigger asChild><Button>Open</Button></ModalTrigger>`.
 * Focus returns to the trigger when the modal closes. A modal opened from
 * state alone has no trigger, so pass `onCloseAutoFocus` to `ModalContent`
 * to say where focus goes.
 */
const ModalTrigger = DialogPrimitive.Trigger

/**
 * Closes the modal when activated. Wrap a Button with `asChild` to keep its styling:
 * `<ModalClose asChild><Button variant="secondary">Cancel</Button></ModalClose>`
 */
const ModalClose = DialogPrimitive.Close

const ModalContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    /**
     * The element the overlay and panel are portalled into. Defaults to
     * `document.body`. A modal opened below a `DirectionProvider` or a themed
     * wrapper passes that element, so it keeps the direction and the palette.
     */
    container?: React.ComponentProps<typeof DialogPrimitive.Portal>["container"]
  }
>(({ className, children, container, ...props }, ref) => (
  <DialogPrimitive.Portal container={container}>
    <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-newt-overlay" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed start-1/2 top-1/2 z-[100] w-[440px] max-w-[90vw] -translate-y-1/2 translate-x-[calc(var(--newt-dir)*-50%)] rounded-lg bg-newt-bg-elevated shadow-elevation-high outline-none",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))
ModalContent.displayName = "ModalContent"

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-4 pt-4", className)} {...props} />
))
ModalHeader.displayName = "ModalHeader"

/** The dialog's accessible name. Give it real text. */
const ModalTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("m-0 text-xl font-semibold", className)}
    {...props}
  />
))
ModalTitle.displayName = "ModalTitle"

/**
 * Radix links it to the dialog with `aria-describedby`. A modal without one
 * passes `aria-describedby={undefined}` to `ModalContent` to say so.
 */
const ModalDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("m-0 text-sm leading-5 text-newt-text-secondary", className)}
    {...props}
  />
))
ModalDescription.displayName = "ModalDescription"

const ModalBody = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "p-4 text-sm leading-5 text-newt-text-secondary",
        className
      )}
      {...props}
    />
  )
)
ModalBody.displayName = "ModalBody"

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-end gap-2 rounded-b-lg bg-newt-bg-surface p-4",
      className
    )}
    {...props}
  />
))
ModalFooter.displayName = "ModalFooter"

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
}
