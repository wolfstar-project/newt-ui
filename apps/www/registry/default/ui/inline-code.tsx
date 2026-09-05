import * as React from "react"

import { cn } from "@/lib/utils"

const InlineCode = React.forwardRef<HTMLElement, React.ComponentProps<"code">>(
  ({ className, ...props }, ref) => (
    <code
      ref={ref}
      className={cn(
        /* `pre-wrap` keeps wrapped code readable without eating the spacing. */
        "whitespace-pre-wrap rounded-sm border border-newt-border bg-newt-bg-base px-1 font-mono text-[0.85em] text-newt-text-primary",
        className
      )}
      {...props}
    />
  )
)
InlineCode.displayName = "InlineCode"

export { InlineCode }
