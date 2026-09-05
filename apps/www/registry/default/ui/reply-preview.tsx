import * as React from "react"

import { cn } from "@/lib/utils"

const ReplyPreview = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mb-1 flex min-w-0 items-center gap-1.5 pl-[18px] text-[13px] leading-4 text-newt-text-muted",
      /* The elbow that hooks the preview back up to the message above it. */
      "before:absolute before:left-0 before:top-1/2 before:h-3 before:w-3 before:-translate-y-full before:rounded-tl-[6px] before:border-l-2 before:border-t-2 before:border-newt-border before:content-['']",
      className
    )}
    {...props}
  />
))
ReplyPreview.displayName = "ReplyPreview"

const ReplyPreviewAvatar = React.forwardRef<
  HTMLImageElement,
  React.ComponentProps<"img">
>(({ className, alt = "", ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    aria-hidden={alt === "" ? true : undefined}
    className={cn("h-4 w-4 shrink-0 rounded-full object-cover", className)}
    {...props}
  />
))
ReplyPreviewAvatar.displayName = "ReplyPreviewAvatar"

const ReplyPreviewAuthor = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("shrink-0 font-medium text-newt-text-link", className)}
    {...props}
  />
))
ReplyPreviewAuthor.displayName = "ReplyPreviewAuthor"

const ReplyPreviewText = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "min-w-0 max-w-[360px] truncate text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ReplyPreviewText.displayName = "ReplyPreviewText"

/* "used" — the verb between the author and an interaction chip. */
const ReplyPreviewAction = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("shrink-0", className)} {...props} />
))
ReplyPreviewAction.displayName = "ReplyPreviewAction"

/* The command chip shown when the reply is a slash-command interaction. */
const ReplyPreviewCommand = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex min-w-0 items-center gap-0.5 rounded-sm bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] px-1 font-medium text-newt-mention-text",
      className
    )}
    {...props}
  >
    <span className="truncate">{children}</span>
  </span>
))
ReplyPreviewCommand.displayName = "ReplyPreviewCommand"

export {
  ReplyPreview,
  ReplyPreviewAvatar,
  ReplyPreviewAuthor,
  ReplyPreviewText,
  ReplyPreviewAction,
  ReplyPreviewCommand,
}
