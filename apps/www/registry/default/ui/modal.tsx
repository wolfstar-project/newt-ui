"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type ModalContextValue = {
  close: () => void
  titleId: string
}

const ModalContext = React.createContext<ModalContextValue | null>(null)

function useModalContext() {
  const ctx = React.useContext(ModalContext)
  if (!ctx) {
    throw new Error("Modal components must be rendered inside <Modal>")
  }
  return ctx
}

export interface ModalProps extends React.ComponentProps<"div"> {
  /** Whether the modal is shown. */
  open?: boolean
  /** Called with `false` when the overlay is clicked, Escape is pressed or a ModalClose is activated. */
  onOpenChange?: (open: boolean) => void
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open = false, onOpenChange, children, ...props }, ref) => {
    const titleId = React.useId()
    const close = React.useCallback(() => onOpenChange?.(false), [onOpenChange])

    React.useEffect(() => {
      if (!open) return
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") close()
      }
      document.addEventListener("keydown", onKeyDown)
      return () => document.removeEventListener("keydown", onKeyDown)
    }, [open, close])

    if (!open) return null

    return (
      <ModalContext.Provider value={{ close, titleId }}>
        <div
          data-state="open"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "w-[440px] max-w-[90vw] rounded-lg bg-newt-bg-elevated shadow-elevation-high",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>
    )
  }
)
Modal.displayName = "Modal"

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  const { titleId } = useModalContext()
  return (
    <div
      ref={ref}
      id={titleId}
      className={cn("px-4 pt-4 text-xl font-semibold", className)}
      {...props}
    />
  )
})
ModalHeader.displayName = "ModalHeader"

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

export interface ModalCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Render the child element instead of a button, injecting the click handler. */
  asChild?: boolean
}

/**
 * Closes the modal when activated. Wrap a Button with `asChild` to keep its styling:
 * `<ModalClose asChild><Button variant="secondary">Cancel</Button></ModalClose>`
 */
const ModalClose = React.forwardRef<HTMLButtonElement, ModalCloseProps>(
  ({ asChild, onClick, children, ...props }, ref) => {
    const { close } = useModalContext()
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      if (!e.defaultPrevented) close()
    }
    if (asChild && React.isValidElement(children)) {
      // SAFETY: asChild renders an arbitrary child element and must inject an
      // onClick handler; React.isValidElement only narrows to
      // ReactElement<unknown>, so the caller-supplied element's prop shape
      // can't be verified from ReactNode alone.
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const child = children as React.ReactElement<{
        onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
      }>
      return React.cloneElement(child, {
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
          child.props.onClick?.(e)
          handleClick(e)
        },
      })
    }
    return (
      <button ref={ref} type="button" onClick={handleClick} {...props}>
        {children}
      </button>
    )
  }
)
ModalClose.displayName = "ModalClose"

export { Modal, ModalHeader, ModalBody, ModalFooter, ModalClose }
