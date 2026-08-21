"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const stageBannerVariants = cva(
  "group flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium",
  {
    variants: {
      variant: {
        brand: "bg-newt-brand text-white",
        neutral:
          "border border-newt-border bg-newt-bg-elevated text-newt-text-primary",
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  }
)

export interface StageBannerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stageBannerVariants> {
  /** Controlled visibility; when omitted the banner manages its own state. */
  open?: boolean
  /** Fired when the banner is dismissed via StageBannerClose. */
  onOpenChange?: (open: boolean) => void
}

type StageBannerContextValue = { close: () => void }
const StageBannerContext = React.createContext<StageBannerContextValue>({
  close: () => {},
})

const StageBanner = React.forwardRef<HTMLDivElement, StageBannerProps>(
  ({ className, variant, open, onOpenChange, children, ...props }, ref) => {
    const [internalOpen, setInternalOpen] = React.useState(true)
    const isControlled = open !== undefined
    const isOpen = isControlled ? open : internalOpen

    const close = React.useCallback(() => {
      if (!isControlled) setInternalOpen(false)
      onOpenChange?.(false)
    }, [isControlled, onOpenChange])

    if (!isOpen) return null

    return (
      <StageBannerContext.Provider value={{ close }}>
        <div
          ref={ref}
          data-variant={variant ?? "brand"}
          className={cn(stageBannerVariants({ variant }), className)}
          {...props}
        >
          {children}
        </div>
      </StageBannerContext.Provider>
    )
  }
)
StageBanner.displayName = "StageBanner"

const stageBannerDotVariants = cva("h-2 w-2 shrink-0 rounded-full", {
  variants: {
    status: {
      white: "bg-white",
      online: "bg-newt-online",
      idle: "bg-newt-idle",
      dnd: "bg-newt-dnd",
      offline: "bg-newt-offline",
    },
  },
  defaultVariants: {
    status: "white",
  },
})

export interface StageBannerDotProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof stageBannerDotVariants> {}

const StageBannerDot = React.forwardRef<HTMLSpanElement, StageBannerDotProps>(
  ({ className, status, ...props }, ref) => (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn(stageBannerDotVariants({ status }), className)}
      {...props}
    />
  )
)
StageBannerDot.displayName = "StageBannerDot"

const StageBannerAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "ml-auto shrink-0 cursor-pointer rounded-sm border-0 bg-black/20 px-2.5 py-1 text-xs font-semibold text-white transition-colors duration-fast ease-newt hover:bg-black/[0.32]",
      className
    )}
    {...props}
  />
))
StageBannerAction.displayName = "StageBannerAction"

const StageBannerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, children, type = "button", ...props }, ref) => {
  const { close } = React.useContext(StageBannerContext)
  return (
    <button
      ref={ref}
      type={type}
      aria-label="Dismiss"
      className={cn(
        "ml-auto shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base leading-none text-white/80 transition-colors duration-fast ease-newt hover:text-white",
        "group-data-[variant=neutral]:text-newt-text-muted group-data-[variant=neutral]:hover:text-newt-text-primary",
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
StageBannerClose.displayName = "StageBannerClose"

export {
  StageBanner,
  StageBannerDot,
  StageBannerAction,
  StageBannerClose,
  stageBannerVariants,
  stageBannerDotVariants,
}
