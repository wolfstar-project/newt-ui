"use client"

import { Popover as PopoverPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Radix owns the behaviour: open state, Escape and outside press, focus
 * return to the trigger, and collision-aware placement. Only the look is
 * newt/ui's.
 */
const Popover = PopoverPrimitive.Root

/*
 * It has no look of its own. Pass `asChild` to put the state on your own
 * button, or the classes of the button it should be, for example
 * `className={buttonVariants({ variant: "secondary" })}`.
 */
const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 flex w-[280px] max-w-[90vw] flex-col items-start gap-2 rounded-md border border-newt-border bg-newt-bg-floating p-3 text-sm leading-5 text-newt-text-secondary shadow-elevation-high outline-none",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent }
