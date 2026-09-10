import { cva, type VariantProps } from "class-variance-authority"
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
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  /** Current value, 0–max */
  value?: number
  max?: number
  indicatorClassName?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, indicatorClassName, value = 0, max = 100, variant, ...props },
    ref
  ) => {
    const clamped = Math.min(Math.max(value, 0), max)
    const percent = max > 0 ? (clamped / max) * 100 : 0
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={clamped}
        className={cn(
          "h-2 w-full overflow-hidden rounded-full bg-newt-bg-base",
          className
        )}
        {...props}
      >
        <div
          className={cn(progressVariants({ variant }), indicatorClassName)}
          style={{ width: `${percent}%` }}
        />
      </div>
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
