import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"
import { scrollbarClassName } from "@/registry/bases/newt/ui/scrollbar"

/*
 * The picker that opens above the composer once a message starts with `/`.
 * Focus stays in the composer: wire `aria-activedescendant` on the input to
 * the id of the active option rather than moving focus into the list.
 *
 * A grid, so the parts need no wrapper: the rail and the list share the first
 * row, the footer takes the second, and a rail laid as a row takes the third.
 * The picker is a size container: its parts change layout from its own width,
 * not from the viewport. Set `--newt-slash-suggestions-max-width` to change
 * the 640px cap, or to `none` to fill the composer.
 */
const SlashCommandSuggestions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "grid max-h-80 w-full max-w-[var(--newt-slash-suggestions-max-width,640px)] grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_auto_auto] overflow-hidden rounded-[var(--newt-radius-lg)] bg-newt-bg-floating text-newt-text-primary shadow-elevation-high [container-type:inline-size]",
      className
    )}
    {...props}
  />
))
SlashCommandSuggestions.displayName = "SlashCommandSuggestions"

const railOrientations = {
  vertical: "col-start-1 row-start-1 flex-col overflow-y-auto border-e",
  horizontal:
    "col-span-full row-start-3 flex-row overflow-x-auto overflow-y-hidden border-t",
}

/* The horizontal layout again, for a picker narrower than 480px. */
const railNarrow =
  "[@container_(max-width:480px)]:col-span-full [@container_(max-width:480px)]:row-start-3 [@container_(max-width:480px)]:flex-row [@container_(max-width:480px)]:overflow-x-auto [@container_(max-width:480px)]:overflow-y-hidden [@container_(max-width:480px)]:border-e-0 [@container_(max-width:480px)]:border-t"

export interface SlashCommandSuggestionsRailProps extends React.ComponentProps<"nav"> {
  /**
   * Lays the rail as a column beside the list, or as a row under it. Without
   * it, the rail is a column, and a row when the picker is narrower than 480px.
   */
  orientation?: "vertical" | "horizontal"
}

/* Strip of app icons that filters the list by app. */
const SlashCommandSuggestionsRail = React.forwardRef<
  HTMLElement,
  SlashCommandSuggestionsRailProps
>(({ className, orientation, ...props }, ref) => (
  <nav
    ref={ref}
    data-orientation={orientation}
    className={cn(
      "flex items-center gap-2 border-newt-border bg-newt-bg-base p-2",
      railOrientations[orientation ?? "vertical"],
      orientation === undefined && railNarrow,
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
    className={cn(
      "col-start-2 row-start-1 min-w-0 overflow-y-auto p-2",
      scrollbarClassName,
      className
    )}
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

/* Bar under the rail and the list, for the command being typed. */
const SlashCommandSuggestionsFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "col-span-full row-start-2 flex min-w-0 items-center gap-2 border-t border-newt-border px-3 py-2 text-[13px] leading-snug text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
SlashCommandSuggestionsFooter.displayName = "SlashCommandSuggestionsFooter"

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

/*
 * An image fills the circle. Anything else is a glyph at half its size: an
 * inline SVG, or the element an icon component renders, which is often a
 * `<span>`.
 */
const appIconVariants = cva(
  "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-newt-bg-elevated text-newt-text-muted [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-1/2 [&>svg]:w-1/2 [&>:first-child:not(img)]:h-1/2 [&>:first-child:not(img)]:w-1/2",
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

/*
 * In a picker narrower than 480px, the app name moves beside the command
 * name, and the description takes the full width under them, on up to two
 * lines.
 */
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
        "grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[var(--newt-radius-md)] px-2 py-1.5",
        "[@container_(max-width:480px)]:gap-x-2 [@container_(max-width:480px)]:gap-y-0.5",
        disabled
          ? "cursor-default opacity-60"
          : "cursor-pointer hover:bg-newt-bg-hover",
        "data-[state=active]:bg-newt-bg-active",
        className
      )}
      {...props}
    >
      {icon}
      <div className="flex min-w-0 flex-col gap-0.5 [@container_(max-width:480px)]:contents">
        <span className="text-[15px] font-semibold leading-tight text-newt-text-primary [@container_(max-width:480px)]:col-start-2 [@container_(max-width:480px)]:row-start-1">
          {/* The slash stands off the command path. A margin keeps the text `/ban`. */}
          <span className="me-1">/</span>
          {name}
        </span>
        {description ? (
          <span className="truncate text-[13px] leading-snug text-newt-text-secondary [@container_(max-width:480px)]:col-[2/-1] [@container_(max-width:480px)]:row-start-2 [@container_(max-width:480px)]:line-clamp-2 [@container_(max-width:480px)]:whitespace-normal">
            {description}
          </span>
        ) : null}
      </div>
      {appLabel ? (
        <span className="shrink-0 text-[13px] text-newt-text-secondary [@container_(max-width:480px)]:col-start-3 [@container_(max-width:480px)]:row-start-1">
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
      "min-h-11 cursor-pointer rounded-[var(--newt-radius-md)] px-3 py-2 hover:bg-newt-bg-hover",
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
  SlashCommandSuggestionsFooter,
  SlashCommandSuggestionGroup,
  SlashCommandAppIcon,
  SlashCommandSuggestion,
  SlashCommandSuggestionMatched,
}
