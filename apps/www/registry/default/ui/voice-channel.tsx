import * as React from "react"

import { cn } from "@/lib/utils"

const VoiceChannel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1 rounded-sm px-2 py-1.5", className)}
    {...props}
  />
))
VoiceChannel.displayName = "VoiceChannel"

const VoiceChannelHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center gap-1.5 text-[15px] font-medium text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
VoiceChannelHeader.displayName = "VoiceChannelHeader"

const VoiceChannelIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("shrink-0 opacity-80", className)}
    {...props}
  />
))
VoiceChannelIcon.displayName = "VoiceChannelIcon"

const VoiceChannelMembers = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-0.5 pl-6", className)}
    {...props}
  />
))
VoiceChannelMembers.displayName = "VoiceChannelMembers"

const VoiceChannelMember = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center gap-2 rounded-sm px-1.5 py-[3px] text-sm text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover",
      className
    )}
    {...props}
  />
))
VoiceChannelMember.displayName = "VoiceChannelMember"

export interface VoiceChannelMemberIconsProps extends React.ComponentProps<"div"> {
  /** Renders the icons in the dnd color to signal a muted / deafened member. */
  muted?: boolean
}

const VoiceChannelMemberIcons = React.forwardRef<
  HTMLDivElement,
  VoiceChannelMemberIconsProps
>(({ className, muted = false, ...props }, ref) => (
  <div
    ref={ref}
    data-muted={muted ? "" : undefined}
    className={cn(
      "ml-auto flex items-center gap-1 text-xs text-newt-text-muted",
      muted && "text-newt-dnd",
      className
    )}
    {...props}
  />
))
VoiceChannelMemberIcons.displayName = "VoiceChannelMemberIcons"

export {
  VoiceChannel,
  VoiceChannelHeader,
  VoiceChannelIcon,
  VoiceChannelMembers,
  VoiceChannelMember,
  VoiceChannelMemberIcons,
}
