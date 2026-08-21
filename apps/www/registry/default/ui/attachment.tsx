import * as React from "react"

import { cn } from "@/lib/utils"

const Attachment = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex max-w-[360px] items-center gap-3 rounded-md border border-newt-border bg-newt-bg-surface px-3 py-[10px]",
      className
    )}
    {...props}
  />
))
Attachment.displayName = "Attachment"

const AttachmentIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-newt-brand font-mono text-xs font-bold text-white",
      className
    )}
    {...props}
  />
))
AttachmentIcon.displayName = "AttachmentIcon"

const AttachmentMeta = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
))
AttachmentMeta.displayName = "AttachmentMeta"

const AttachmentName = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "truncate text-sm font-medium text-newt-text-link",
      className
    )}
    {...props}
  />
))
AttachmentName.displayName = "AttachmentName"

const AttachmentSize = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs text-newt-text-muted", className)}
    {...props}
  />
))
AttachmentSize.displayName = "AttachmentSize"

export {
  Attachment,
  AttachmentIcon,
  AttachmentMeta,
  AttachmentName,
  AttachmentSize,
}
