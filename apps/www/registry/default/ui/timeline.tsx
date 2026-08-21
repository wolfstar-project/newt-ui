import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const Timeline = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col", className)} {...props} />
))
Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex gap-3 pb-5 last:pb-0",
      "before:absolute before:bottom-0 before:left-[11px] before:top-6 before:w-0.5 before:bg-newt-border before:content-[''] last:before:hidden",
      className
    )}
    {...props}
  />
))
TimelineItem.displayName = "TimelineItem"

const timelineDotVariants = cva(
  "z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-newt-border bg-newt-bg-surface text-xs",
  {
    variants: {
      variant: {
        default: "",
        success: "border-newt-online text-newt-online",
        danger: "border-newt-dnd text-newt-dnd",
        brand: "border-newt-brand text-[#b3baff]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface TimelineDotProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {}

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(timelineDotVariants({ variant }), className)}
      {...props}
    />
  )
)
TimelineDot.displayName = "TimelineDot"

const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex-1 pt-px", className)} {...props} />
))
TimelineContent.displayName = "TimelineContent"

const TimelineTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm font-semibold text-newt-text-primary", className)}
    {...props}
  />
))
TimelineTitle.displayName = "TimelineTitle"

const TimelineMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-0.5 text-xs text-newt-text-muted", className)}
    {...props}
  />
))
TimelineMeta.displayName = "TimelineMeta"

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  TimelineTitle,
  TimelineMeta,
  timelineDotVariants,
}
