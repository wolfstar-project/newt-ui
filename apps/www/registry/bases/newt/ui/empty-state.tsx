import * as React from "react"

import { cn } from "@/lib/utils"

const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center gap-2 px-5 py-10 text-center text-newt-text-muted",
      className
    )}
    {...props}
  />
))
EmptyState.displayName = "EmptyState"

const EmptyStateIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn("mb-1 text-[40px] leading-none opacity-60", className)}
    {...props}
  />
))
EmptyStateIcon.displayName = "EmptyStateIcon"

const EmptyStateTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-semibold text-newt-text-primary", className)}
    {...props}
  />
))
EmptyStateTitle.displayName = "EmptyStateTitle"

const EmptyStateDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-w-[320px] text-sm leading-normal", className)}
    {...props}
  />
))
EmptyStateDescription.displayName = "EmptyStateDescription"

export { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription }
