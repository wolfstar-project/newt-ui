import * as React from "react"

import { cn } from "@/lib/utils"

/* The app directory card a link to an app unfurls into inside a message. */
const AppInvite = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <article
    ref={ref}
    className={cn(
      "flex max-w-[432px] flex-col overflow-hidden rounded-lg bg-newt-bg-surface text-newt-text-primary",
      className
    )}
    {...props}
  />
))
AppInvite.displayName = "AppInvite"

const AppInviteBanner = React.forwardRef<
  HTMLImageElement,
  React.ComponentProps<"img">
>(({ className, alt = "", ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    aria-hidden={alt === "" ? true : undefined}
    className={cn(
      "block aspect-[3/1] w-full bg-newt-bg-base object-cover",
      className
    )}
    {...props}
  />
))
AppInviteBanner.displayName = "AppInviteBanner"

const AppInviteBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-4 p-4", className)}
    {...props}
  />
))
AppInviteBody.displayName = "AppInviteBody"

const AppInviteHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-4", className)}
    {...props}
  />
))
AppInviteHeader.displayName = "AppInviteHeader"

const AppInviteIcon = React.forwardRef<
  HTMLImageElement,
  React.ComponentProps<"img">
>(({ className, alt = "", ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    aria-hidden={alt === "" ? true : undefined}
    className={cn(
      "h-20 w-20 shrink-0 rounded-lg bg-newt-bg-base object-cover",
      className
    )}
    {...props}
  />
))
AppInviteIcon.displayName = "AppInviteIcon"

const AppInviteInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0 flex-1", className)} {...props} />
))
AppInviteInfo.displayName = "AppInviteInfo"

export interface AppInviteNameProps extends React.HTMLAttributes<HTMLElement> {
  /** Link to the app's page. Without it the name renders as plain text. */
  href?: string
}

const AppInviteName = React.forwardRef<HTMLElement, AppInviteNameProps>(
  ({ className, href, ...props }, ref) =>
    /* A link only when there is somewhere to go; plain text otherwise. */
    React.createElement(href === undefined ? "span" : "a", {
      ref,
      href,
      className: cn(
        "block truncate text-base font-bold text-newt-text-primary no-underline",
        href !== undefined && "hover:underline",
        className
      ),
      ...props,
    })
)
AppInviteName.displayName = "AppInviteName"

const AppInviteDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mt-1 line-clamp-2 text-sm text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
AppInviteDescription.displayName = "AppInviteDescription"

export {
  AppInvite,
  AppInviteBanner,
  AppInviteBody,
  AppInviteHeader,
  AppInviteIcon,
  AppInviteInfo,
  AppInviteName,
  AppInviteDescription,
}
