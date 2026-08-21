import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-newt-border bg-newt-bg-elevated p-5 text-newt-text-primary",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

const CardTitle = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mb-1 text-base font-semibold", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("m-0 text-sm text-newt-text-secondary", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

export { Card, CardTitle, CardDescription }
