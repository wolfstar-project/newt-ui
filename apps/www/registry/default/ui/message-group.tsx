import * as React from "react"

import { cn } from "@/lib/utils"

export interface MessageGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Lay the row out as a 2x2 grid so a `MessageGroupReply` can hook over the
   * avatar, the way the client stacks a reply above the message it answers.
   */
  withReply?: boolean
  /** Tint the row as an ephemeral (visible-to-you-only) response. */
  ephemeral?: boolean
}

const MessageGroup = React.forwardRef<HTMLDivElement, MessageGroupProps>(
  ({ className, withReply = false, ephemeral = false, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="message-row"
      data-ephemeral={ephemeral || undefined}
      className={cn(
        "gap-4 py-1",
        withReply
          ? "grid grid-cols-[auto_minmax(0,1fr)] grid-rows-[auto_auto] items-start [&>[data-slot=message-avatar]]:col-start-1 [&>[data-slot=message-avatar]]:row-start-2 [&>[data-slot=message-body]]:col-start-2 [&>[data-slot=message-body]]:row-start-2 [&>[data-slot=message-reply]]:col-start-2 [&>[data-slot=message-reply]]:row-start-1"
          : "flex",
        ephemeral
          ? "border-l-2 border-[color-mix(in_srgb,var(--newt-text-link)_40%,transparent)] bg-[color-mix(in_srgb,var(--newt-text-link)_10%,transparent)] hover:bg-[color-mix(in_srgb,var(--newt-text-link)_15%,transparent)]"
          : "hover:bg-black/[0.06]",
        className
      )}
      {...props}
    />
  )
)
MessageGroup.displayName = "MessageGroup"

const MessageGroupAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="message-avatar"
    className={cn("shrink-0", className)}
    {...props}
  />
))
MessageGroupAvatar.displayName = "MessageGroupAvatar"

const MessageGroupReply = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="message-reply"
    className={cn("min-w-0", className)}
    {...props}
  />
))
MessageGroupReply.displayName = "MessageGroupReply"

const MessageGroupBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="message-body"
    className={cn("min-w-0 flex-1", className)}
    {...props}
  />
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

export interface MessageGroupBotTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Add the check Discord puts on verified applications. */
  verified?: boolean
}

const MessageGroupBotTag = React.forwardRef<
  HTMLSpanElement,
  MessageGroupBotTagProps
>(({ className, verified = false, children = "BOT", ...props }, ref) => (
  <span
    ref={ref}
    role="img"
    aria-label={verified ? "Verified application" : "Application"}
    className={cn(
      "inline-flex items-center gap-0.5 rounded-[3px] bg-newt-brand px-1 py-px text-[10px] font-semibold uppercase tracking-[0.02em] text-white",
      className
    )}
    {...props}
  >
    {verified ? (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="h-2.5 w-2.5"
      >
        <path
          fill="currentColor"
          d="M9.55 17.6 4.4 12.45l1.4-1.4 3.75 3.75 8.65-8.65 1.4 1.4z"
        />
      </svg>
    ) : null}
    {children}
  </span>
))
MessageGroupBotTag.displayName = "MessageGroupBotTag"

/* A real `<time>`: the timestamp is machine-readable, not just small text. */
const MessageGroupTime = React.forwardRef<
  HTMLTimeElement,
  React.ComponentProps<"time">
>(({ className, ...props }, ref) => (
  <time
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

/*
 * The "only you can see this" footer Discord shows under an ephemeral reply.
 * Children replace the default copy; the dismiss control is the caller's.
 */
const MessageGroupEphemeralNotice = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="status"
    className={cn(
      "mt-1.5 flex items-center gap-1 text-[13px] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
MessageGroupEphemeralNotice.displayName = "MessageGroupEphemeralNotice"

const MessageGroupEphemeralAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-newt-text-link hover:underline",
      className
    )}
    {...props}
  />
))
MessageGroupEphemeralAction.displayName = "MessageGroupEphemeralAction"

export {
  MessageGroup,
  MessageGroupAvatar,
  MessageGroupReply,
  MessageGroupBody,
  MessageGroupHeader,
  MessageGroupAuthor,
  MessageGroupBotTag,
  MessageGroupTime,
  MessageGroupContent,
  MessageGroupReactions,
  MessageGroupEphemeralNotice,
  MessageGroupEphemeralAction,
}
