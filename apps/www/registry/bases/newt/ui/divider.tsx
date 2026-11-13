"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { Separator as SeparatorPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

const dividerVariants = cva(
  "flex items-center gap-3 text-xs font-semibold text-newt-text-muted data-[orientation=vertical]:flex-col data-[orientation=vertical]:self-stretch",
  {
    variants: {
      /* Spacing steps, for stacking dividers inside dense containers. */
      spacing: {
        sm: "my-1 data-[orientation=vertical]:mx-1 data-[orientation=vertical]:my-0",
        md: "my-4 data-[orientation=vertical]:mx-4 data-[orientation=vertical]:my-0",
        lg: "my-6 data-[orientation=vertical]:mx-6 data-[orientation=vertical]:my-0",
      },
      /* Pure spacing: keeps the gap, drops the rules around the label. */
      line: {
        true: "before:h-px before:flex-1 before:bg-newt-border before:content-[''] after:h-px after:flex-1 after:bg-newt-border after:content-[''] data-[orientation=vertical]:before:h-auto data-[orientation=vertical]:before:w-px data-[orientation=vertical]:after:h-auto data-[orientation=vertical]:after:w-px",
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
    React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    VariantProps<typeof dividerVariants> {}

/*
 * Radix owns the semantics: `role="separator"`, `aria-orientation` when it is
 * vertical, and no role at all when it is `decorative`. Only the look is
 * newt/ui's.
 */
const Divider = React.forwardRef<
  React.ComponentRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(({ className, spacing, line, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    className={cn(dividerVariants({ spacing, line }), className)}
    {...props}
  />
))
Divider.displayName = "Divider"

export { Divider, dividerVariants }
