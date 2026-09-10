import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The row of interactive components under a message. Discord fits five per
 * row, so stack rows when a message needs more than that.
 */
const ActionRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    className={cn("flex flex-wrap items-center gap-2 [&+&]:mt-2", className)}
    {...props}
  />
))
ActionRow.displayName = "ActionRow"

export { ActionRow }
