import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Tailwind classes that give any scrollable container Discord-styled
 * scrollbars (thin, rounded thumb, transparent track). Apply via
 * `<ScrollArea>` or spread `scrollbarClassName` on your own element.
 */
const scrollbarClassName = [
  "[scrollbar-width:thin] [scrollbar-color:var(--newt-bg-active)_transparent]",
  "[&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar]:w-4",
  "[&::-webkit-scrollbar-track]:bg-transparent",
  "[&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb]:border-4 [&::-webkit-scrollbar-thumb]:border-solid [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-newt-bg-active [&::-webkit-scrollbar-thumb]:bg-clip-padding",
  "[&::-webkit-scrollbar-thumb:hover]:bg-newt-text-muted [&::-webkit-scrollbar-thumb:hover]:bg-clip-padding",
  "[&::-webkit-scrollbar-corner]:bg-transparent",
].join(" ")

export interface ScrollAreaProps extends React.ComponentProps<"div"> {
  /**
   * Put the viewport in the tab order so it can be scrolled from the keyboard
   * (WCAG 2.1.1). Off by default: a focusable region only helps when the area
   * actually scrolls and holds no other focusable content.
   */
  focusable?: boolean
  /** Accessible name of the focusable viewport. */
  viewportLabel?: string
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      focusable = false,
      viewportLabel = "Scrollable region",
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      tabIndex={focusable ? 0 : undefined}
      role={focusable ? "group" : undefined}
      aria-label={focusable ? viewportLabel : undefined}
      className={cn("overflow-auto", scrollbarClassName, className)}
      {...props}
    />
  )
)
ScrollArea.displayName = "ScrollArea"

export { ScrollArea, ScrollArea as Scrollbar, scrollbarClassName }
