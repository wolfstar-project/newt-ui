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
      "max-w-[432px] rounded-[var(--newt-radius-md)] bg-newt-bg-surface px-4 pb-4 pt-2 text-newt-text-primary",
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

/*
 * The props of the element or component `as` names, so a custom image
 * component's own props type-check.
 */
export type InviteIconProps<E extends React.ElementType = "img"> = {
  /**
   * The image element or component to render. Defaults to `img`; pass your
   * framework's image component for optimised sources.
   */
  as?: E
} & Omit<React.ComponentPropsWithRef<E>, "as">

type InviteIconComponent = {
  <E extends React.ElementType = "img">(
    props: InviteIconProps<E>
  ): React.ReactNode
  displayName?: string
}

/*
 * SAFETY: `forwardRef` drops the generic signature. The render hands every
 * prop it does not set itself to `as` unchanged, so the props of `as` are
 * the props the part receives.
 */
// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- see SAFETY
const InviteIcon = React.forwardRef<HTMLImageElement, InviteIconProps>(
  ({ as: Tag = "img", className, alt = "", ...props }, ref) => (
    <Tag
      ref={ref}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      className={cn(
        "h-12 w-12 shrink-0 rounded-[var(--newt-radius-md)] object-cover",
        className
      )}
      {...props}
    />
  )
) as InviteIconComponent
InviteIcon.displayName = "InviteIcon"

const InviteInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
))
InviteInfo.displayName = "InviteInfo"

/*
 * The props of the element or component `as` names, so a router link's own
 * props, such as `to`, type-check.
 */
export type InviteNameProps<E extends React.ElementType = "a"> = {
  /**
   * The element or component to render. Defaults to `a`; pass a router link
   * component to keep client navigation.
   */
  as?: E
} & Omit<React.ComponentPropsWithRef<E>, "as">

type InviteNameComponent = {
  <E extends React.ElementType = "a">(
    props: InviteNameProps<E>
  ): React.ReactNode
  displayName?: string
}

/*
 * SAFETY: `forwardRef` drops the generic signature. The render hands every
 * prop it does not set itself to `as` unchanged, so the props of `as` are
 * the props the part receives.
 */
// oxlint-disable-next-line typescript/no-unsafe-type-assertion -- see SAFETY
const InviteName = React.forwardRef<HTMLAnchorElement, InviteNameProps>(
  ({ as: Tag = "a", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "block truncate font-bold text-newt-text-primary no-underline hover:underline",
        className
      )}
      {...props}
    />
  )
) as InviteNameComponent
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
