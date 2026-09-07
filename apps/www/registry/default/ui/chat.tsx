import * as React from "react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/registry/default/ui/scrollbar"

/* The channel shell: a scrolling message log with the composer pinned below. */
const Chat = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-newt-bg-elevated",
        className
      )}
      {...props}
    />
  )
)
Chat.displayName = "Chat"

export interface ChatBodyProps extends React.ComponentProps<
  typeof ScrollArea
> {}

const ChatBody = React.forwardRef<HTMLDivElement, ChatBodyProps>(
  ({ className, children, ...props }, ref) => (
    <ScrollArea
      ref={ref}
      className={cn("min-h-0 flex-1", className)}
      {...props}
    >
      {/*
       * Pins a short conversation to the bottom of the scrollport, the way a
       * channel with three messages still reads from the composer upwards.
       */}
      <div className="flex min-h-full flex-col justify-end">{children}</div>
    </ScrollArea>
  )
)
ChatBody.displayName = "ChatBody"

const ChatFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("shrink-0 px-4 pb-4", className)} {...props} />
))
ChatFooter.displayName = "ChatFooter"

export { Chat, ChatBody, ChatFooter }
