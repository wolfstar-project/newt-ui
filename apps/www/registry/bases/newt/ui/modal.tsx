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

/* ---------------------------------------------------------------------------
 * Focus
 *
 * A modal dialog owns the keyboard while it is open: focus moves into it,
 * Tab and Shift+Tab cycle through its controls without reaching the page
 * behind, and closing hands focus back to whatever held it before.
 * ------------------------------------------------------------------------ */

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  "[tabindex]:not([tabindex='-1'])",
].join(",")

/** The controls Tab can reach inside `container`, in tab order. */
function tabbablesIn(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
    (element) => {
      if (element.tabIndex < 0 || element.closest("[inert]")) return false
      const style = getComputedStyle(element)
      return style.visibility !== "hidden" && style.display !== "none"
    }
  )
}

/** Keeps a Tab press inside `container`, wrapping at either end. */
function containTab(event: KeyboardEvent, container: HTMLElement) {
  const tabbables = tabbablesIn(container)
  const first = tabbables[0]
  const last = tabbables[tabbables.length - 1]
  const active = document.activeElement
  if (first === undefined || last === undefined) {
    event.preventDefault()
    container.focus()
    return
  }
  const inside = active instanceof Node && container.contains(active)
  if (event.shiftKey && (!inside || active === first || active === container)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && (!inside || active === last)) {
    event.preventDefault()
    first.focus()
  }
}

export interface ModalProps extends React.ComponentProps<"div"> {
  /** Whether the modal is shown. */
  open?: boolean
  /** Called with `false` when the overlay is clicked, Escape is pressed or a ModalClose is activated. */
  onOpenChange?: (open: boolean) => void
}

/**
 * A modal dialog. While open it takes focus (its first control, or itself
 * when it has none), keeps Tab and Shift+Tab inside, and on close returns
 * focus to the element that held it when it opened.
 */
const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  ({ className, open = false, onOpenChange, children, ...props }, ref) => {
    const titleId = React.useId()
    const dialog = React.useRef<HTMLDivElement | null>(null)
    React.useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
      ref,
      () => dialog.current
    )
    const close = React.useCallback(() => onOpenChange?.(false), [onOpenChange])

    React.useEffect(() => {
      if (!open) return
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") close()
        else if (e.key === "Tab" && dialog.current) {
          containTab(e, dialog.current)
        }
      }
      document.addEventListener("keydown", onKeyDown)
      return () => document.removeEventListener("keydown", onKeyDown)
    }, [open, close])

    React.useEffect(() => {
      const element = dialog.current
      if (!open || !element) return
      const opener = document.activeElement
      /* An `autoFocus` child has already taken focus by now; leave it there
       * and, since the opener is lost, skip the return. */
      const returnTo =
        opener instanceof HTMLElement && !element.contains(opener)
          ? opener
          : null
      if (returnTo !== null) (tabbablesIn(element)[0] ?? element).focus()
      return () => {
        if (returnTo?.isConnected) returnTo.focus()
      }
    }, [open])

    if (!open) return null

    return (
      <ModalContext.Provider value={{ close, titleId }}>
        <div
          data-state="open"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-newt-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={cn(
              "w-[440px] max-w-[90vw] rounded-lg bg-newt-bg-elevated shadow-elevation-high outline-none",
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
