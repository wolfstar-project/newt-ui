"use client"

import { Tooltip as TooltipPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Radix owns the behaviour: hover and focus delay, Escape to dismiss, and
 * collision-aware placement. Only the look is newt/ui's.
 */
const TooltipProvider = TooltipPrimitive.Provider

/* Each tooltip brings its own provider, so one needs no setup. */
function Tooltip({
  delayDuration = 150,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  /** Milliseconds the pointer rests on the trigger before the tooltip opens. */
  delayDuration?: number
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root {...props} />
    </TooltipPrimitive.Provider>
  )
}

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 whitespace-nowrap rounded-sm bg-[#111214] px-2.5 py-1.5 text-xs font-medium text-newt-text-primary shadow-elevation-high",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent }
