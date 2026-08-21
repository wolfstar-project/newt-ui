import * as React from "react"

import { cn } from "@/lib/utils"

const MessageGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-4 py-1 hover:bg-black/[0.06]", className)}
    {...props}
  />
))
MessageGroup.displayName = "MessageGroup"

const MessageGroupBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
))
MessageGroupBody.displayName = "MessageGroupBody"

const MessageGroupHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-1 flex items-baseline gap-2", className)}
    {...props}
  />
))
MessageGroupHeader.displayName = "MessageGroupHeader"

const MessageGroupAuthor = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-[15px] font-semibold text-newt-text-primary",
      className
    )}
    {...props}
  />
))
MessageGroupAuthor.displayName = "MessageGroupAuthor"

const MessageGroupBotTag = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children = "BOT", ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "rounded-[3px] bg-newt-brand px-1 py-px text-[10px] font-semibold uppercase tracking-[0.02em] text-white",
      className
    )}
    {...props}
  >
    {children}
  </span>
))
MessageGroupBotTag.displayName = "MessageGroupBotTag"

const MessageGroupTime = React.forwardRef<
  HTMLSpanElement,
  React.TimeHTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-[11px] text-newt-text-muted", className)}
    {...props}
  />
))
MessageGroupTime.displayName = "MessageGroupTime"

const MessageGroupContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[15px] leading-[1.5] text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
MessageGroupContent.displayName = "MessageGroupContent"

const MessageGroupReactions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-1.5 flex flex-wrap gap-1", className)}
    {...props}
  />
))
MessageGroupReactions.displayName = "MessageGroupReactions"

export {
  MessageGroup,
  MessageGroupBody,
  MessageGroupHeader,
  MessageGroupAuthor,
  MessageGroupBotTag,
  MessageGroupTime,
  MessageGroupContent,
  MessageGroupReactions,
}
