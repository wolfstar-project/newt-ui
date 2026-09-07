import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const dividerVariants = cva(
  "flex items-center gap-3 text-xs font-semibold text-newt-text-muted",
  {
    variants: {
      /* Spacing steps, for stacking dividers inside dense containers. */
      spacing: {
        sm: "my-1",
        md: "my-4",
        lg: "my-6",
      },
      /* Pure spacing: keeps the gap, drops the rules around the label. */
      line: {
        true: "before:h-px before:flex-1 before:bg-newt-border before:content-[''] after:h-px after:flex-1 after:bg-newt-border after:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      spacing: "md",
      line: true,
    },
  }
)

export interface DividerProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {}

const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, spacing, line, children, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(dividerVariants({ spacing, line }), className)}
      {...props}
    >
      {children}
    </div>
  )
)
Divider.displayName = "Divider"

export { Divider, dividerVariants }
