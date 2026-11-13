"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Progress as ProgressPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "h-full rounded-full transition-[width] duration-base ease-newt",
  {
    variants: {
      variant: {
        default: "bg-[linear-gradient(90deg,var(--newt-brand),#8c54ff)]",
        success: "bg-[linear-gradient(90deg,var(--newt-online),#45c178)]",
        danger: "bg-[linear-gradient(90deg,var(--newt-dnd),#f4878a)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
      "value"
    >,
    VariantProps<typeof progressVariants> {
  /** Current value, 0–max */
  value?: number
  indicatorClassName?: string
}

/*
 * Radix owns the semantics: `role="progressbar"`, the `aria-value*`
 * attributes and `data-state` (`loading` or `complete`). Only the look is
 * newt/ui's.
 */
const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(
  (
    { className, indicatorClassName, value = 0, max = 100, variant, ...props },
    ref
  ) => {
    /* Radix reads a value outside 0–max as indeterminate, so clamp it first. */
    const limit = max > 0 ? max : 100
    const clamped = Math.min(Math.max(value, 0), limit)
    return (
      <ProgressPrimitive.Root
        ref={ref}
        value={clamped}
        max={limit}
        className={cn(
          "h-2 w-full overflow-hidden rounded-full bg-newt-bg-base",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(progressVariants({ variant }), indicatorClassName)}
          style={{ width: `${(clamped / limit) * 100}%` }}
        />
      </ProgressPrimitive.Root>
    )
  }
)
Progress.displayName = "Progress"

const ProgressLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-1.5 flex justify-between text-xs text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ProgressLabel.displayName = "ProgressLabel"

export { Progress, ProgressLabel, progressVariants }
