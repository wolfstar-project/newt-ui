import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const notifBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-2 border-newt-bg-base text-[11px] font-bold leading-none text-white",
  {
    variants: {
      variant: {
        default: "h-4 min-w-4 bg-newt-dnd px-1",
        mention: "h-4 min-w-4 bg-newt-dnd px-1",
        unread: "h-2 w-2 min-w-0 bg-newt-text-primary p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface NotifBadgeProps
  extends
    React.ComponentProps<"span">,
    VariantProps<typeof notifBadgeVariants> {}

const NotifBadge = React.forwardRef<HTMLSpanElement, NotifBadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(notifBadgeVariants({ variant }), className)}
      {...props}
    />
  )
)
NotifBadge.displayName = "NotifBadge"

export { NotifBadge, notifBadgeVariants }
