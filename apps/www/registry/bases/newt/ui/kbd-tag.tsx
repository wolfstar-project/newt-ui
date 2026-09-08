import * as React from "react"

import { cn } from "@/lib/utils"

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-newt-border bg-newt-bg-base px-1.5 font-mono text-[11px] font-semibold text-newt-text-secondary shadow-[0_1px_0_var(--newt-border)]",
        className
      )}
      {...props}
    />
  )
)
Kbd.displayName = "Kbd"

const KbdTag = Kbd

export { Kbd, KbdTag }
