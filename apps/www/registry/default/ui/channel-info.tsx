import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The panel that slides in over a channel on narrow screens, holding the
 * member list, pins, threads and the rest of the channel detail tabs.
 */
const ChannelInfo = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, role = "dialog", ...props }, ref) => (
  <div
    ref={ref}
    role={role}
    className={cn(
      "flex h-full w-full max-w-sm flex-col overflow-hidden bg-newt-bg-surface text-newt-text-primary",
      className
    )}
    {...props}
  />
))
ChannelInfo.displayName = "ChannelInfo"

const ChannelInfoToolbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-14 shrink-0 items-center justify-between gap-2 px-2",
      className
    )}
    {...props}
  />
))
ChannelInfoToolbar.displayName = "ChannelInfoToolbar"

const ChannelInfoActions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-1", className)}
    {...props}
  />
))
ChannelInfoActions.displayName = "ChannelInfoActions"

const ChannelInfoAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-newt-text-secondary transition-colors duration-fast ease-newt",
      "hover:bg-newt-bg-hover hover:text-newt-text-primary",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
ChannelInfoAction.displayName = "ChannelInfoAction"

const ChannelInfoIdentity = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 items-center gap-3 px-4 pb-3", className)}
    {...props}
  />
))
ChannelInfoIdentity.displayName = "ChannelInfoIdentity"

const ChannelInfoIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children = "#", ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-newt-bg-elevated text-lg font-bold leading-none text-newt-text-muted",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
ChannelInfoIcon.displayName = "ChannelInfoIcon"

const ChannelInfoName = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("truncate font-bold text-newt-text-primary", className)}
    {...props}
  />
))
ChannelInfoName.displayName = "ChannelInfoName"

const ChannelInfoType = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[13px] text-newt-text-muted", className)}
    {...props}
  />
))
ChannelInfoType.displayName = "ChannelInfoType"

/* Scrolling area under the tab strip. */
const ChannelInfoPanel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-h-0 flex-1 overflow-y-auto px-2 pb-4", className)}
    {...props}
  />
))
ChannelInfoPanel.displayName = "ChannelInfoPanel"

const ChannelInfoEmpty = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center gap-2 px-6 py-10 text-center",
      className
    )}
    {...props}
  />
))
ChannelInfoEmpty.displayName = "ChannelInfoEmpty"

const ChannelInfoEmptyIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex h-14 w-14 items-center justify-center rounded-full bg-newt-bg-elevated text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ChannelInfoEmptyIcon.displayName = "ChannelInfoEmptyIcon"

const ChannelInfoEmptyTitle = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-semibold text-newt-text-primary", className)}
    {...props}
  />
))
ChannelInfoEmptyTitle.displayName = "ChannelInfoEmptyTitle"

const ChannelInfoEmptyBody = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("max-w-[36ch] text-sm text-newt-text-muted", className)}
    {...props}
  />
))
ChannelInfoEmptyBody.displayName = "ChannelInfoEmptyBody"

export {
  ChannelInfo,
  ChannelInfoToolbar,
  ChannelInfoActions,
  ChannelInfoAction,
  ChannelInfoIdentity,
  ChannelInfoIcon,
  ChannelInfoName,
  ChannelInfoType,
  ChannelInfoPanel,
  ChannelInfoEmpty,
  ChannelInfoEmptyIcon,
  ChannelInfoEmptyTitle,
  ChannelInfoEmptyBody,
}
