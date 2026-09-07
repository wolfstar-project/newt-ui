import * as React from "react"

import { cn } from "@/lib/utils"

/* The Apps popout: search, recents, and the apps installed in a server. */
const AppLauncher = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, role = "dialog", ...props }, ref) => (
  <div
    ref={ref}
    role={role}
    className={cn(
      "flex h-[min(680px,calc(100dvh-2rem))] w-full max-w-[504px] flex-col overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface text-newt-text-primary shadow-elevation-high",
      className
    )}
    {...props}
  />
))
AppLauncher.displayName = "AppLauncher"

/* Grip shown when the launcher is presented as a bottom sheet. */
const AppLauncherHandle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-newt-border",
      className
    )}
    {...props}
  />
))
AppLauncherHandle.displayName = "AppLauncherHandle"

/* Drill-in header: back control on the left, view title beside it. */
const AppLauncherHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-14 shrink-0 items-center gap-2 px-2 text-base font-semibold",
      className
    )}
    {...props}
  />
))
AppLauncherHeader.displayName = "AppLauncherHeader"

const AppLauncherBack = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-newt-bg-elevated p-0 text-newt-text-secondary transition-colors duration-fast ease-newt",
      "hover:bg-newt-bg-hover hover:text-newt-text-primary",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
AppLauncherBack.displayName = "AppLauncherBack"

const SearchIcon = () => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    className="pointer-events-none absolute start-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-newt-text-muted"
  >
    <circle cx="9" cy="9" r="5.5" />
    <path d="M13 13l4 4" />
  </svg>
)

/* Search field wrapper; place an `<AppLauncherSearchInput>` inside it. */
const AppLauncherSearch = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("shrink-0 px-4 pb-3 pt-4", className)}
    {...props}
  >
    <div className="relative flex items-center">
      <SearchIcon />
      {children}
    </div>
  </div>
))
AppLauncherSearch.displayName = "AppLauncherSearch"

const AppLauncherSearchInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type = "search", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    autoComplete="off"
    spellCheck={false}
    className={cn(
      "h-11 w-full appearance-none rounded-md border-2 border-transparent bg-newt-bg-input py-0 ps-11 pe-3 text-base text-newt-text-primary outline-none",
      "placeholder:text-newt-text-muted focus:border-newt-brand",
      className
    )}
    {...props}
  />
))
AppLauncherSearchInput.displayName = "AppLauncherSearchInput"

const AppLauncherBody = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4",
      className
    )}
    {...props}
  />
))
AppLauncherBody.displayName = "AppLauncherBody"

const AppLauncherSection = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"section">
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    className={cn("flex flex-col gap-2", className)}
    {...props}
  />
))
AppLauncherSection.displayName = "AppLauncherSection"

const AppLauncherSectionHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between gap-2 px-0.5", className)}
    {...props}
  />
))
AppLauncherSectionHeader.displayName = "AppLauncherSectionHeader"

const AppLauncherSectionTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "m-0 inline-flex items-center gap-1 text-base font-medium text-newt-text-primary",
      className
    )}
    {...props}
  />
))
AppLauncherSectionTitle.displayName = "AppLauncherSectionTitle"

const AppLauncherViewMore = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "cursor-pointer rounded-sm border-0 bg-transparent p-0 text-base font-semibold text-newt-text-link no-underline hover:underline",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      className
    )}
    {...props}
  />
))
AppLauncherViewMore.displayName = "AppLauncherViewMore"

/* Card that stacks `<AppLauncherItem>` rows behind one rounded surface. */
const AppLauncherList = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col overflow-hidden rounded-md bg-newt-bg-elevated",
      "[&>*+*]:border-t [&>*+*]:border-newt-border",
      className
    )}
    {...props}
  />
))
AppLauncherList.displayName = "AppLauncherList"

export interface AppLauncherItemProps extends Omit<
  React.ComponentProps<"button">,
  "children"
> {
  name: string
  description?: string
  /** Icon for the app; pair with `<AppLauncherItemIcon>`. */
  icon?: React.ReactNode
  /** Marks a paid placement, as the client does for promoted apps. */
  promoted?: boolean
}

const AppLauncherItem = React.forwardRef<
  HTMLButtonElement,
  AppLauncherItemProps
>(
  (
    {
      className,
      name,
      description,
      icon,
      promoted = false,
      type = "button",
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-3 py-3 text-start transition-colors duration-fast ease-newt",
        "hover:bg-newt-bg-hover",
        "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link",
        className
      )}
      {...props}
    >
      {icon}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-base font-medium leading-tight text-newt-text-primary">
            {name}
          </span>
          {promoted ? (
            <span className="shrink-0 rounded-full bg-newt-text-primary px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-wide text-newt-bg-surface">
              Promoted
            </span>
          ) : null}
        </span>
        {description ? (
          <span className="truncate text-sm leading-snug text-newt-text-muted">
            {description}
          </span>
        ) : null}
      </span>
    </button>
  )
)
AppLauncherItem.displayName = "AppLauncherItem"

export interface AppLauncherItemIconProps extends React.ComponentProps<"span"> {
  /** Bots use circular avatars; games and activities keep the squircle. */
  round?: boolean
}

const AppLauncherItemIcon = React.forwardRef<
  HTMLSpanElement,
  AppLauncherItemIconProps
>(({ className, round = false, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-newt-bg-base text-newt-text-secondary",
      round ? "rounded-full" : "rounded-[10px]",
      "[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-5 [&>svg]:w-5",
      className
    )}
    {...props}
  />
))
AppLauncherItemIcon.displayName = "AppLauncherItemIcon"

/* Horizontal strip of recently used apps. */
const AppLauncherRecents = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      className
    )}
    {...props}
  />
))
AppLauncherRecents.displayName = "AppLauncherRecents"

const AppLauncherRecent = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={cn(
      "inline-flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[14px] border-0 bg-newt-bg-base p-0 text-newt-text-secondary transition-[filter] duration-fast ease-newt",
      "hover:brightness-110",
      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      "[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-6 [&>svg]:w-6",
      className
    )}
    {...props}
  />
))
AppLauncherRecent.displayName = "AppLauncherRecent"

export {
  AppLauncher,
  AppLauncherHandle,
  AppLauncherHeader,
  AppLauncherBack,
  AppLauncherSearch,
  AppLauncherSearchInput,
  AppLauncherBody,
  AppLauncherSection,
  AppLauncherSectionHeader,
  AppLauncherSectionTitle,
  AppLauncherViewMore,
  AppLauncherList,
  AppLauncherItem,
  AppLauncherItemIcon,
  AppLauncherRecents,
  AppLauncherRecent,
}
