import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "flex w-full items-start gap-3 rounded-sm border border-s-4 border-newt-border bg-newt-bg-surface px-3.5 py-3 text-sm leading-5 text-newt-text-secondary",
  {
    variants: {
      variant: {
        info: "border-s-newt-text-link [&>svg]:text-newt-text-link",
        success: "border-s-newt-online [&>svg]:text-newt-online",
        warning: "border-s-newt-idle [&>svg]:text-newt-idle",
        danger: "border-s-newt-danger [&>svg]:text-newt-danger",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

/* One shape per kind, so the kind survives without its colour. */
const ICONS = {
  info: "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm-.8 3.4a.8.8 0 0 1 1.6 0v3.6a.8.8 0 0 1-1.6 0V7.6Z",
  success:
    "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm3.2 5.5-3.6 3.9a.8.8 0 0 1-1.2 0L4.8 8.7a.8.8 0 1 1 1.2-1.1l1 1.1 3-3.3a.8.8 0 0 1 1.2 1.1Z",
  warning:
    "M8.9 1.5a1 1 0 0 0-1.8 0L.6 13.2A1 1 0 0 0 1.5 14.7h13a1 1 0 0 0 .9-1.5L8.9 1.5ZM8 5.5a.8.8 0 0 1 .8.8v3.2a.8.8 0 0 1-1.6 0V6.3a.8.8 0 0 1 .8-.8Zm0 7.2a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z",
  danger:
    "M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 3.5a.8.8 0 0 1 .8.8v3.4a.8.8 0 0 1-1.6 0V5.3a.8.8 0 0 1 .8-.8Zm0 7.4a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z",
} as const

export interface AlertProps
  extends React.ComponentProps<"div">, VariantProps<typeof alertVariants> {}

/*
 * A notice that sits in the page, where a toast floats over it. What kind of
 * notice it is shows three ways: the bar down its leading edge, the icon's
 * shape and the words. A `danger` alert is announced at once (`role="alert"`);
 * the others wait their turn (`role="status"`).
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, role, children, ...props }, ref) => {
    const kind = variant ?? "info"
    return (
      <div
        ref={ref}
        role={role ?? (kind === "danger" ? "alert" : "status")}
        data-variant={kind}
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="h-5 w-5 shrink-0"
        >
          <path fill="currentColor" d={ICONS[kind]} />
        </svg>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">{children}</div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold text-newt-text-primary", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={className} {...props} />
))
AlertDescription.displayName = "AlertDescription"

/** A row of buttons under the text. */
const AlertActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-2 flex flex-wrap gap-2", className)}
    {...props}
  />
))
AlertActions.displayName = "AlertActions"

export { Alert, AlertTitle, AlertDescription, AlertActions, alertVariants }
