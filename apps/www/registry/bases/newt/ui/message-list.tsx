import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The log of grouped messages in a channel. `role="log"` with a polite live
 * region is what makes an arriving message announce itself without stealing
 * focus from whatever the reader is doing.
 */
export interface MessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Accessible name, e.g. `Messages in #general`. */
  label?: string
}

const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(
  ({ className, label, ...props }, ref) => (
    <div
      ref={ref}
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-label={label}
      className={cn(
        "flex min-w-0 flex-col px-2 pb-4 pt-1 sm:px-4",
        /* Rows sit flush: the list owns the padding, not the row. */
        "[&>[data-slot=message-row]]:rounded-sm [&>[data-slot=message-row]]:px-2 [&>[data-slot=message-row]]:py-1.5",
        className
      )}
      {...props}
    />
  )
)
MessageList.displayName = "MessageList"

export { MessageList }
