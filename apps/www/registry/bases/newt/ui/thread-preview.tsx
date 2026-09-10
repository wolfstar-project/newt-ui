import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The thread hanging off a message: its name, how many replies it holds, and
 * who spoke last. It is a link to somewhere else, so the whole card is one
 * control rather than a card with a link inside it — one tab stop, one target,
 * and the hover state belongs to all of it.
 */
const ThreadPreview = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "flex max-w-[440px] items-center gap-2 rounded-md bg-newt-bg-surface px-3 py-2 text-sm no-underline",
      "transition-colors duration-fast ease-newt hover:bg-newt-bg-elevated",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
ThreadPreview.displayName = "ThreadPreview"

/*
 * The elbow that ties the card back to the message above it. Decorative: the
 * relationship is already in the markup, so it is hidden from a reader who is
 * not looking at it.
 */
const ThreadPreviewSpine = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "block h-3 w-4 shrink-0 rounded-ss-[8px] border-s-2 border-t-2 border-newt-border",
      className
    )}
    {...props}
  />
))
ThreadPreviewSpine.displayName = "ThreadPreviewSpine"

const ThreadPreviewName = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("truncate font-medium text-newt-text-link", className)}
    {...props}
  />
))
ThreadPreviewName.displayName = "ThreadPreviewName"

export interface ThreadPreviewCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** How many messages the thread holds. */
  count: number
}

const ThreadPreviewCount = React.forwardRef<
  HTMLSpanElement,
  ThreadPreviewCountProps
>(({ className, count, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "shrink-0 text-xs font-medium tabular-nums text-newt-text-muted",
      className
    )}
    {...props}
  >
    {/* Spelled out rather than a bare number, which would read as an index. */}
    {count === 1 ? "1 message" : `${count} messages`}
  </span>
))
ThreadPreviewCount.displayName = "ThreadPreviewCount"

/** The last thing said in the thread, which is why anyone opens it. */
const ThreadPreviewLast = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("min-w-0 flex-1 truncate text-newt-text-muted", className)}
    {...props}
  />
))
ThreadPreviewLast.displayName = "ThreadPreviewLast"

export {
  ThreadPreview,
  ThreadPreviewCount,
  ThreadPreviewLast,
  ThreadPreviewName,
  ThreadPreviewSpine,
}
