import * as React from "react"

import { cn } from "@/lib/utils"

/* The server-invite card a link unfurls into inside a message. */
const Invite = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "max-w-[432px] rounded-md bg-newt-bg-surface px-4 pb-4 pt-2 text-newt-text-primary",
      className
    )}
    {...props}
  />
))
Invite.displayName = "Invite"

const InviteEyebrow = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-[12px] font-extrabold uppercase tracking-[0.02em] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
InviteEyebrow.displayName = "InviteEyebrow"

const InviteBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-2 flex items-center gap-4", className)}
    {...props}
  />
))
InviteBody.displayName = "InviteBody"

const InviteIcon = React.forwardRef<
  HTMLImageElement,
  React.ComponentProps<"img">
>(({ className, alt = "", ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    aria-hidden={alt === "" ? true : undefined}
    className={cn("h-12 w-12 shrink-0 rounded-md object-cover", className)}
    {...props}
  />
))
InviteIcon.displayName = "InviteIcon"

const InviteInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
))
InviteInfo.displayName = "InviteInfo"

const InviteName = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a">
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "block truncate font-bold text-newt-text-primary no-underline hover:underline",
      className
    )}
    {...props}
  />
))
InviteName.displayName = "InviteName"

const InviteCounts = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-0.5 flex items-center gap-3 text-sm text-newt-text-muted",
      className
    )}
    {...props}
  />
))
InviteCounts.displayName = "InviteCounts"

export interface InviteCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Green dot for the online count, muted for the member total. */
  online?: boolean
}

const InviteCount = React.forwardRef<HTMLSpanElement, InviteCountProps>(
  ({ className, online = false, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-2 w-2 shrink-0 rounded-full",
          online ? "bg-newt-online" : "bg-newt-offline"
        )}
      />
      {children}
    </span>
  )
)
InviteCount.displayName = "InviteCount"

export {
  Invite,
  InviteEyebrow,
  InviteBody,
  InviteIcon,
  InviteInfo,
  InviteName,
  InviteCounts,
  InviteCount,
}
