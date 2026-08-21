import * as React from "react"

import { cn } from "@/lib/utils"

const Divider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn(
      "my-4 flex items-center gap-3 text-xs font-semibold text-newt-text-muted",
      "before:h-px before:flex-1 before:bg-newt-border before:content-['']",
      "after:h-px after:flex-1 after:bg-newt-border after:content-['']",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
Divider.displayName = "Divider"

export { Divider }
