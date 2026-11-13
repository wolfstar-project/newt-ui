"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Toast as ToastPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const toastVariants = cva(
  [
    "flex max-w-[360px] items-start gap-3 rounded-md border border-newt-border bg-newt-bg-elevated px-3.5 py-3 text-newt-text-primary shadow-elevation-high",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
    /* The toast follows the pointer while it is swiped away. */
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-fast data-[swipe=cancel]:ease-newt",
  ],
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
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-newt-on-accent",
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

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>["variant"]>

/* The variant of the enclosing toast, which picks the icon's colour and glyph. */
const ToastVariantContext = React.createContext<ToastVariant>("success")

/*
 * Radix owns the behaviour: the dismiss timer and its pause on hover, focus
 * and window blur, swipe to dismiss, Escape, and the announcement to screen
 * readers. Only the look is newt/ui's. Every toast needs a `ToastProvider`
 * above it and a `ToastViewport` inside that provider.
 */
const ToastProvider = ToastPrimitive.Provider

/*
 * The list every toast of the provider is rendered into, wherever the toast
 * itself is written. It floats at the bottom inline-end corner. Pass
 * `className="static items-start"` to lay it out in the page flow instead.
 */
const ToastViewport = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 end-4 z-[130] m-0 flex max-w-[calc(100vw-2rem)] list-none flex-col items-end gap-3 p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = "ToastViewport"

export interface ToastProps
  extends
    React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root>,
    VariantProps<typeof toastVariants> {
  /**
   * Auto-dismiss after this many ms. Defaults to the provider's `duration`,
   * which is 5000. Pass 0 to disable.
   */
  duration?: number
}

const Toast = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Root>,
  ToastProps
>(({ className, variant, duration, type = "background", ...props }, ref) => {
  const resolved = variant ?? "success"
  return (
    <ToastVariantContext.Provider value={resolved}>
      <ToastPrimitive.Root
        ref={ref}
        /* `background` announces politely; `foreground` interrupts. */
        type={type}
        /* Radix reads 0 as "not set" and falls back to the provider's value. */
        duration={duration === 0 ? Infinity : duration}
        data-variant={resolved}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    </ToastVariantContext.Provider>
  )
})
Toast.displayName = "Toast"

const ToastIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const variant = React.useContext(ToastVariantContext)
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
  React.ComponentRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = "ToastTitle"

const ToastDescription = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn(
      "mt-0.5 text-[13px] text-[var(--newt-text-secondary)]",
      className
    )}
    {...props}
  />
))
ToastDescription.displayName = "ToastDescription"

/*
 * A button that acts on the toast and then closes it. It has no look of its
 * own; wrap a Button with `asChild`. `altText` tells a screen reader user
 * another way to do the same thing, because the toast can be gone before
 * they reach the button.
 */
const ToastAction = ToastPrimitive.Action

const ToastClose = React.forwardRef<
  React.ComponentRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    aria-label="Dismiss"
    className={cn(
      "shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base leading-none text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-primary",
      className
    )}
    {...props}
  >
    {children ?? "×"}
  </ToastPrimitive.Close>
))
ToastClose.displayName = "ToastClose"

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  toastVariants,
  toastIconVariants,
}
