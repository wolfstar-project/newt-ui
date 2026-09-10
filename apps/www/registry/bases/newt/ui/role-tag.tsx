import * as React from "react"

import { cn } from "@/lib/utils"

export interface RoleTagProps extends React.ComponentProps<"span"> {
  /** Role colour applied to the tag; the dot inherits it via `currentColor`. */
  color?: string
}

const RoleTag = React.forwardRef<HTMLSpanElement, RoleTagProps>(
  ({ className, color, style, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border border-newt-border bg-newt-bg-elevated px-1.5 py-0.5 text-[11px] font-semibold",
        className
      )}
      style={color ? { color, ...style } : style}
      {...props}
    />
  )
)
RoleTag.displayName = "RoleTag"

const RoleTagDot = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("h-2 w-2 rounded-full bg-current", className)}
    {...props}
  />
))
RoleTagDot.displayName = "RoleTagDot"

export { RoleTag, RoleTagDot }
