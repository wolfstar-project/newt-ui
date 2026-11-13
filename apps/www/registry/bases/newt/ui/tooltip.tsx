"use client"

import { Tooltip as TooltipPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Radix owns the behaviour: hover and focus delay, Escape to dismiss, and
 * collision-aware placement. Only the look is newt/ui's.
 */
const DEFAULT_DELAY = 150

/* True below a `TooltipProvider`, so a tooltip knows it can share that one. */
const SharedProviderContext = React.createContext(false)

/*
 * Optional. Wrap a group of tooltips in one provider and they share its
 * delays: after one closes, its neighbour opens with no wait.
 */
function TooltipProvider({
  delayDuration = DEFAULT_DELAY,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <SharedProviderContext.Provider value={true}>
      <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
    </SharedProviderContext.Provider>
  )
}

/* A tooltip with no `TooltipProvider` above it brings its own. */
function Tooltip({
  delayDuration,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  /** Milliseconds the pointer rests on the trigger before the tooltip opens. */
  delayDuration?: number
}) {
  const shared = React.useContext(SharedProviderContext)
  if (shared) {
    return <TooltipPrimitive.Root delayDuration={delayDuration} {...props} />
  }
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration ?? DEFAULT_DELAY}>
      <TooltipPrimitive.Root {...props} />
    </TooltipPrimitive.Provider>
  )
}

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    /**
     * The element the tooltip is portalled into. Defaults to `document.body`;
     * pass the enclosing native `<dialog>` or a themed wrapper to keep it there.
     */
    container?: React.ComponentProps<
      typeof TooltipPrimitive.Portal
    >["container"]
  }
>(({ className, sideOffset = 8, container, ...props }, ref) => (
  <TooltipPrimitive.Portal container={container}>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-[120] whitespace-nowrap rounded-sm bg-[#111214] px-2.5 py-1.5 text-xs font-medium text-newt-text-primary shadow-elevation-high",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent }
