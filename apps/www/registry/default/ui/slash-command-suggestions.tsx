import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The picker that opens above the composer once a message starts with `/`.
 * Focus stays in the composer: wire `aria-activedescendant` on the input to
 * the id of the active option rather than moving focus into the list.
 */
const SlashCommandSuggestions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex max-h-80 w-full max-w-[640px] overflow-hidden rounded-lg bg-newt-bg-floating text-newt-text-primary shadow-elevation-high",
      className
    )}
    {...props}
  />
))
SlashCommandSuggestions.displayName = "SlashCommandSuggestions"

/* Vertical strip of app icons that filters the list by app. */
const SlashCommandSuggestionsRail = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"nav">
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      "flex shrink-0 flex-col items-center gap-2 overflow-y-auto border-r border-newt-border bg-newt-bg-base p-2",
      className
    )}
    {...props}
  />
))
SlashCommandSuggestionsRail.displayName = "SlashCommandSuggestionsRail"

export interface SlashCommandSuggestionsRailItemProps extends React.ComponentProps<"button"> {
  active?: boolean
}

const SlashCommandSuggestionsRailItem = React.forwardRef<
  HTMLButtonElement,
  SlashCommandSuggestionsRailItemProps
>(({ className, active = false, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    aria-pressed={active}
    data-state={active ? "active" : "inactive"}
    className={cn(
      "inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-newt-text-muted transition-colors duration-fast ease-newt",
      "hover:bg-newt-bg-hover hover:text-newt-text-primary",
      "data-[state=active]:bg-newt-bg-active data-[state=active]:text-newt-text-primary",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
SlashCommandSuggestionsRailItem.displayName = "SlashCommandSuggestionsRailItem"

const SlashCommandSuggestionsList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, role = "listbox", ...props }, ref) => (
  <div
    ref={ref}
    role={role}
    className={cn("min-w-0 flex-1 overflow-y-auto p-2", className)}
    {...props}
  />
))
SlashCommandSuggestionsList.displayName = "SlashCommandSuggestionsList"

/* Sticky section header, as used by the "Frequently Used" block. */
const SlashCommandSuggestionsHeader = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    role="presentation"
    className={cn(
      "sticky top-0 z-[1] m-0 flex items-center gap-1.5 bg-newt-bg-floating px-2 py-1.5 text-sm font-semibold text-newt-text-primary",
      className
    )}
    {...props}
  />
))
SlashCommandSuggestionsHeader.displayName = "SlashCommandSuggestionsHeader"

const SlashCommandSuggestionGroup = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"section">
>(({ className, role = "group", ...props }, ref) => (
  <section
    ref={ref}
    role={role}
    className={cn("min-w-0", className)}
    {...props}
  />
))
SlashCommandSuggestionGroup.displayName = "SlashCommandSuggestionGroup"

const appIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-newt-bg-elevated text-newt-text-muted [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-1/2 [&>svg]:w-1/2",
  {
    variants: {
      size: {
        header: "h-4 w-4",
        row: "h-6 w-6",
        rail: "h-8 w-8",
      },
    },
    defaultVariants: { size: "row" },
  }
)

export interface SlashCommandAppIconProps
  extends React.ComponentProps<"span">, VariantProps<typeof appIconVariants> {}

const SlashCommandAppIcon = React.forwardRef<
  HTMLSpanElement,
  SlashCommandAppIconProps
>(({ className, size, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(appIconVariants({ size }), className)}
    {...props}
  />
))
SlashCommandAppIcon.displayName = "SlashCommandAppIcon"

export interface SlashCommandSuggestionProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Command path without the leading slash, e.g. `moderation ban`. */
  name: string
  description?: string
  /** Name of the app the command belongs to, shown on the right. */
  appLabel?: string
  /** Icon for the owning app; pair with `<SlashCommandAppIcon>`. */
  icon?: React.ReactNode
  active?: boolean
  disabled?: boolean
}

const SlashCommandSuggestion = React.forwardRef<
  HTMLDivElement,
  SlashCommandSuggestionProps
>(
  (
    {
      className,
      name,
      description,
      appLabel,
      icon,
      active = false,
      disabled = false,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      role="option"
      aria-selected={active}
      aria-disabled={disabled || undefined}
      data-state={active ? "active" : "inactive"}
      className={cn(
        "grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-md px-2 py-1.5",
        disabled
          ? "cursor-default opacity-60"
          : "cursor-pointer hover:bg-newt-bg-hover",
        "data-[state=active]:bg-newt-bg-active",
        className
      )}
      {...props}
    >
      {icon}
      <div className="flex min-w-0 flex-col gap-0.5">
        {/* The client spaces the slash away from the command path. */}
        <span className="text-[15px] font-semibold leading-tight text-newt-text-primary">
          /&nbsp;{name}
        </span>
        {description ? (
          <span className="truncate text-[13px] leading-snug text-newt-text-muted">
            {description}
          </span>
        ) : null}
      </div>
      {appLabel ? (
        <span className="shrink-0 text-[13px] text-newt-text-muted">
          {appLabel}
        </span>
      ) : null}
    </div>
  )
)
SlashCommandSuggestion.displayName = "SlashCommandSuggestion"

export interface SlashCommandSuggestionMatchedProps extends React.ComponentProps<"div"> {
  active?: boolean
}

/* Row that previews the command already typed, rendered with `<SlashCommand>`. */
const SlashCommandSuggestionMatched = React.forwardRef<
  HTMLDivElement,
  SlashCommandSuggestionMatchedProps
>(({ className, active = false, ...props }, ref) => (
  <div
    ref={ref}
    role="option"
    aria-selected={active}
    data-state={active ? "active" : "inactive"}
    className={cn(
      "min-h-11 cursor-pointer rounded-md px-3 py-2 hover:bg-newt-bg-hover",
      "data-[state=active]:bg-newt-bg-active",
      className
    )}
    {...props}
  />
))
SlashCommandSuggestionMatched.displayName = "SlashCommandSuggestionMatched"

export {
  SlashCommandSuggestions,
  SlashCommandSuggestionsRail,
  SlashCommandSuggestionsRailItem,
  SlashCommandSuggestionsList,
  SlashCommandSuggestionsHeader,
  SlashCommandSuggestionGroup,
  SlashCommandAppIcon,
  SlashCommandSuggestion,
  SlashCommandSuggestionMatched,
}
