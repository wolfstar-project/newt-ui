"use client"

import type { VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { avatarVariants } from "@/registry/bases/newt/ui/avatar"

export interface AvatarGroupProps
  extends React.ComponentProps<"div">, VariantProps<typeof avatarVariants> {
  /**
   * How many members are not shown. A count above zero adds a final "+N"
   * chip; the total usually comes from the server, not from the children.
   */
  overflow?: number
  /** What a screen reader says for the chip. */
  overflowLabel?: (count: number) => string
}

const defaultOverflowLabel = (count: number) => `${count} more`

/*
 * A few avatars, overlapped, and a count for the rest. Each one is ringed in
 * the colour of the surface behind it so the overlap reads as a cut-out; set
 * `--newt-avatar-group-ring` when the group sits on something other than the
 * default surface. `size` is the chip's size: give the avatars the same one.
 */
const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      className,
      size,
      overflow = 0,
      overflowLabel = defaultOverflowLabel,
      children,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="group"
      className={cn(
        "inline-flex items-center [&>*:not(:first-child)]:-ms-2 [&>*]:shadow-[0_0_0_2px_var(--newt-avatar-group-ring,var(--newt-bg-surface))]",
        className
      )}
      {...props}
    >
      {children}
      {overflow > 0 ? (
        <div
          className={cn(
            avatarVariants({ size }),
            "bg-newt-bg-active tabular-nums text-newt-text-primary"
          )}
        >
          <span aria-hidden="true">+{overflow}</span>
          <span className="sr-only">{overflowLabel(overflow)}</span>
        </div>
      ) : null}
    </div>
  )
)
AvatarGroup.displayName = "AvatarGroup"

export { AvatarGroup }
