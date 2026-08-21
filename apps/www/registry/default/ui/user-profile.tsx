import * as React from "react"

import { cn } from "@/lib/utils"

const UserProfile = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-[280px] overflow-hidden rounded-lg border border-newt-border bg-newt-bg-base shadow-elevation-high",
      className
    )}
    {...props}
  />
))
UserProfile.displayName = "UserProfile"

const UserProfileBanner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-[60px] bg-newt-brand", className)}
    {...props}
  />
))
UserProfileBanner.displayName = "UserProfileBanner"

const UserProfileHead = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative px-4 pb-3", className)} {...props} />
))
UserProfileHead.displayName = "UserProfileHead"

const UserProfileActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex justify-end gap-2 pb-9 pt-2", className)}
    {...props}
  />
))
UserProfileActions.displayName = "UserProfileActions"

const UserProfileAvatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute -top-6 left-4 rounded-full border-4 border-newt-bg-base",
      className
    )}
    {...props}
  />
))
UserProfileAvatar.displayName = "UserProfileAvatar"

const UserProfileName = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-base font-bold text-newt-text-primary", className)}
    {...props}
  />
))
UserProfileName.displayName = "UserProfileName"

const UserProfileHandle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-[10px] text-[13px] text-newt-text-muted", className)}
    {...props}
  />
))
UserProfileHandle.displayName = "UserProfileHandle"

const UserProfileDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("my-[10px] h-px bg-newt-border", className)}
    {...props}
  />
))
UserProfileDivider.displayName = "UserProfileDivider"

const UserProfileBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("px-4 pb-4", className)} {...props} />
))
UserProfileBody.displayName = "UserProfileBody"

const UserProfileSectionLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-[6px] text-[11px] font-bold uppercase tracking-[0.06em] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
UserProfileSectionLabel.displayName = "UserProfileSectionLabel"

const UserProfileBio = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[13px] leading-[1.5] text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
UserProfileBio.displayName = "UserProfileBio"

const UserProfileRoles = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-wrap gap-1", className)} {...props} />
))
UserProfileRoles.displayName = "UserProfileRoles"

export {
  UserProfile,
  UserProfileBanner,
  UserProfileHead,
  UserProfileActions,
  UserProfileAvatar,
  UserProfileName,
  UserProfileHandle,
  UserProfileDivider,
  UserProfileBody,
  UserProfileSectionLabel,
  UserProfileBio,
  UserProfileRoles,
}
