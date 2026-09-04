"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const reactionVariants = cva(
  "inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5 text-[13px] transition-[background-color,border-color] duration-fast ease-newt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
  {
    variants: {
      active: {
        false:
          "border-newt-border bg-newt-bg-surface text-newt-text-secondary hover:bg-newt-bg-hover",
        true: "border-newt-brand bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] text-newt-mention-text",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

function isStringNode(value: React.ReactNode): value is string {
  return Object.prototype.toString.call(value) === "[object String]"
}

export interface ReactionProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    VariantProps<typeof reactionVariants> {
  /** Emoji or icon rendered on the left. */
  emoji: React.ReactNode
  /** Number of users who reacted. */
  count: number
  /** Controlled active state. */
  active?: boolean
  /** Initial active state when uncontrolled. */
  defaultActive?: boolean
  /** Called with the next active state when toggled. */
  onActiveChange?: (active: boolean) => void
}

const Reaction = React.forwardRef<HTMLButtonElement, ReactionProps>(
  (
    {
      className,
      emoji,
      count,
      active: activeProp,
      defaultActive = false,
      onActiveChange,
      onClick,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultActive)
    const isControlled = activeProp !== undefined
    const active = isControlled ? activeProp : uncontrolled

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      const next = !active
      if (!isControlled) setUncontrolled(next)
      onActiveChange?.(next)
    }

    const label =
      ariaLabel ??
      `${isStringNode(emoji) ? emoji : "Emoji"} reaction, ${count} ${
        count === 1 ? "person" : "people"
      }${active ? ", you reacted" : ""}`

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        aria-label={label}
        data-state={active ? "active" : "inactive"}
        className={cn(reactionVariants({ active }), className)}
        onClick={handleClick}
        {...props}
      >
        <span aria-hidden="true">{emoji}</span>
        <span className="text-xs font-semibold">{count}</span>
      </button>
    )
  }
)
Reaction.displayName = "Reaction"

/* The row of reactions under a message. */
const ReactionGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-1 flex flex-wrap items-center gap-1", className)}
    {...props}
  />
))
ReactionGroup.displayName = "ReactionGroup"

export { Reaction, ReactionGroup, reactionVariants }
