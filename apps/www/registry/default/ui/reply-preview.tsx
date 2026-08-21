import * as React from "react"

import { cn } from "@/lib/utils"

const ReplyPreview = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mb-1 flex items-center gap-1.5 pl-[18px] text-[13px] text-newt-text-muted",
      "before:absolute before:left-0 before:top-1/2 before:h-3 before:w-3 before:-translate-y-full before:rounded-tl-[6px] before:border-l-2 before:border-t-2 before:border-newt-border before:content-['']",
      className
    )}
    {...props}
  />
))
ReplyPreview.displayName = "ReplyPreview"

const ReplyPreviewAuthor = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("font-medium text-newt-text-link", className)}
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
    className={cn("max-w-[360px] truncate text-newt-text-muted", className)}
    {...props}
  />
))
ReplyPreviewText.displayName = "ReplyPreviewText"

export { ReplyPreview, ReplyPreviewAuthor, ReplyPreviewText }
