"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const toastVariants = cva(
  "flex max-w-[360px] items-start gap-3 rounded-md border border-newt-border bg-newt-bg-elevated px-3.5 py-3 text-newt-text-primary shadow-elevation-high",
  {
    variants: {
      variant: {
        success: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

const toastIconVariants = cva(
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-white",
  {
    variants: {
      variant: {
        success: "bg-newt-online",
        error: "bg-newt-dnd",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

export interface ToastProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  /** Auto-dismiss after this many ms. Defaults to 5000. Pass 0 to disable. */
  duration?: number
  /** Controlled open state. */
  open?: boolean
  /** Called when the toast closes, either by timeout or the close button. */
  onOpenChange?: (open: boolean) => void
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant,
      duration = 5000,
      open,
      onOpenChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(true)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen

    const close = React.useCallback(() => {
      if (!isControlled) setInternalOpen(false)
      onOpenChange?.(false)
    }, [isControlled, onOpenChange])

    React.useEffect(() => {
      if (!isOpen || duration <= 0) return
      const id = window.setTimeout(close, duration)
      return () => window.clearTimeout(id)
    }, [isOpen, duration, close])

    if (!isOpen) return null

    return (
      <ToastContext.Provider value={{ variant: variant ?? "success", close }}>
        <div
          ref={ref}
          role="status"
          aria-live="polite"
          data-variant={variant ?? "success"}
          className={cn(toastVariants({ variant }), className)}
          {...props}
        >
          {children}
        </div>
      </ToastContext.Provider>
    )
  }
)
Toast.displayName = "Toast"

type ToastContextValue = {
  variant: NonNullable<VariantProps<typeof toastVariants>["variant"]>
  close: () => void
}
const ToastContext = React.createContext<ToastContextValue>({
  variant: "success",
  close: () => {},
})

const ToastIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { variant } = React.useContext(ToastContext)
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(toastIconVariants({ variant }), className)}
      {...props}
    >
      {children ?? (variant === "success" ? "✓" : "!")}
    </div>
  )
})
ToastIcon.displayName = "ToastIcon"

const ToastContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
))
ToastContent.displayName = "ToastContent"

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-0.5 text-[13px] text-[var(--newt-text-secondary)]",
      className
    )}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, children, ...props }, ref) => {
  const { close } = React.useContext(ToastContext)
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Dismiss"
      className={cn(
        "shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base leading-none text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-primary",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        if (!e.defaultPrevented) close()
      }}
      {...props}
    >
      {children ?? "×"}
    </button>
  )
})
ToastClose.displayName = "ToastClose"

export {
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  toastVariants,
  toastIconVariants,
}
