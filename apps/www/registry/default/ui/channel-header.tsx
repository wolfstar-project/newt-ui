import * as React from "react"

import { cn } from "@/lib/utils"

/* The bar above the message list: channel name, topic, and channel actions. */
const ChannelHeader = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"header">
>(({ className, ...props }, ref) => (
  <header
    ref={ref}
    className={cn(
      "flex h-12 items-center justify-between gap-3 border-b border-newt-border bg-newt-bg-surface pl-4 pr-3 text-newt-text-primary",
      className
    )}
    {...props}
  />
))
ChannelHeader.displayName = "ChannelHeader"

const ChannelHeaderInfo = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 items-center gap-2", className)}
    {...props}
  />
))
ChannelHeaderInfo.displayName = "ChannelHeaderInfo"

const ChannelHeaderIcon = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children = "#", ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "shrink-0 text-xl font-bold leading-none text-newt-text-muted",
      className
    )}
    {...props}
  >
    {children}
  </span>
))
ChannelHeaderIcon.displayName = "ChannelHeaderIcon"

const ChannelHeaderName = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "shrink-0 truncate text-base font-semibold text-newt-text-primary",
      className
    )}
    {...props}
  />
))
ChannelHeaderName.displayName = "ChannelHeaderName"

/* Round dot that sets the topic apart from the channel name. */
const ChannelHeaderDivider = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "h-1 w-1 shrink-0 rounded-full bg-newt-text-muted opacity-70",
      className
    )}
    {...props}
  />
))
ChannelHeaderDivider.displayName = "ChannelHeaderDivider"

const ChannelHeaderTopic = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "min-w-0 truncate text-[13px] font-medium text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ChannelHeaderTopic.displayName = "ChannelHeaderTopic"

const ChannelHeaderToolbar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex shrink-0 items-center gap-4", className)}
    {...props}
  />
))
ChannelHeaderToolbar.displayName = "ChannelHeaderToolbar"

export interface ChannelHeaderActionProps extends React.ComponentProps<"button"> {
  /** Keeps a toggled action (such as the member list) lit up. */
  active?: boolean
}

const ChannelHeaderAction = React.forwardRef<
  HTMLButtonElement,
  ChannelHeaderActionProps
>(({ className, active = false, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    data-state={active ? "active" : "inactive"}
    className={cn(
      "inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-newt-text-muted transition-colors duration-fast ease-newt",
      "hover:text-newt-text-primary data-[state=active]:text-newt-text-primary",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
ChannelHeaderAction.displayName = "ChannelHeaderAction"

const SearchIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    className="h-4 w-4 shrink-0"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 14 14" />
  </svg>
)

export interface ChannelHeaderSearchProps extends React.ComponentProps<"button"> {
  placeholder?: string
}

const ChannelHeaderSearch = React.forwardRef<
  HTMLButtonElement,
  ChannelHeaderSearchProps
>(
  (
    {
      className,
      placeholder = "Search",
      type = "button",
      children,
      "aria-label": ariaLabel = placeholder,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      className={cn(
        "flex h-7 w-60 shrink-0 cursor-pointer items-center justify-between gap-3 rounded-sm border border-newt-border bg-newt-bg-input px-2 text-newt-text-muted transition-colors duration-fast ease-newt",
        "hover:border-newt-text-muted",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
        className
      )}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-left text-sm font-medium leading-none">
        {children ?? placeholder}
      </span>
      <SearchIcon />
    </button>
  )
)
ChannelHeaderSearch.displayName = "ChannelHeaderSearch"

/* Compact "N Online" readout used by the narrow layout of the header. */
const ChannelHeaderOnline = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1.5 text-xs text-newt-text-muted",
      className
    )}
    {...props}
  >
    <span
      aria-hidden="true"
      className="h-2 w-2 shrink-0 rounded-full bg-newt-online"
    />
    {children}
  </span>
))
ChannelHeaderOnline.displayName = "ChannelHeaderOnline"

export {
  ChannelHeader,
  ChannelHeaderInfo,
  ChannelHeaderIcon,
  ChannelHeaderName,
  ChannelHeaderDivider,
  ChannelHeaderTopic,
  ChannelHeaderToolbar,
  ChannelHeaderAction,
  ChannelHeaderSearch,
  ChannelHeaderOnline,
}
