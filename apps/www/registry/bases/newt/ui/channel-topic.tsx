import * as React from "react"

import { cn } from "@/lib/utils"

const ChannelTopic = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-w-0 items-center gap-2 border-b border-newt-border px-4 py-3 text-sm",
      className
    )}
    {...props}
  />
))
ChannelTopic.displayName = "ChannelTopic"

const ChannelTopicIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children = "#", ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("shrink-0 font-bold text-newt-text-muted", className)}
    {...props}
  >
    {children}
  </span>
))
ChannelTopicIcon.displayName = "ChannelTopicIcon"

const ChannelTopicName = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "shrink-0 whitespace-nowrap font-bold text-newt-text-primary",
      className
    )}
    {...props}
  />
))
ChannelTopicName.displayName = "ChannelTopicName"

const ChannelTopicDivider = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("h-[18px] w-px shrink-0 bg-newt-border", className)}
    {...props}
  />
))
ChannelTopicDivider.displayName = "ChannelTopicDivider"

const ChannelTopicDescription = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "overflow-hidden text-ellipsis whitespace-nowrap text-[13px] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ChannelTopicDescription.displayName = "ChannelTopicDescription"

export {
  ChannelTopic,
  ChannelTopicIcon,
  ChannelTopicName,
  ChannelTopicDivider,
  ChannelTopicDescription,
}
