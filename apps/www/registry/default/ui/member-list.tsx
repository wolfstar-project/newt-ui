import * as React from "react"

import { cn } from "@/lib/utils"

const MemberList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="list"
    className={cn("flex flex-col", className)}
    {...props}
  />
))
MemberList.displayName = "MemberList"

/*
 * Discord groups members under each hoisted role, then Online, then Offline.
 * `offline` dims the whole group rather than every row on its own.
 */
export interface MemberListSectionProps extends React.HTMLAttributes<HTMLElement> {
  offline?: boolean
}

const MemberListSection = React.forwardRef<HTMLElement, MemberListSectionProps>(
  ({ className, offline = false, ...props }, ref) => (
    <section
      ref={ref}
      data-offline={offline || undefined}
      className={cn(
        "[&:not(:first-child)]:mt-3",
        offline &&
          "[&_[role=listitem]]:opacity-45 [&_[data-slot=member-name]]:text-newt-text-muted",
        className
      )}
      {...props}
    />
  )
)
MemberListSection.displayName = "MemberListSection"

const MemberListHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "m-0 px-2 pb-0.5 text-[12px] font-semibold uppercase leading-4 tracking-[0.02em] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
MemberListHeading.displayName = "MemberListHeading"

const MemberListItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="listitem"
    className={cn(
      "flex min-w-0 cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors duration-fast ease-newt hover:bg-newt-bg-hover",
      className
    )}
    {...props}
  />
))
MemberListItem.displayName = "MemberListItem"

const MemberListNameRow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 items-center gap-1", className)}
    {...props}
  />
))
MemberListNameRow.displayName = "MemberListNameRow"

const MemberListInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex min-w-0 flex-col leading-[1.2]", className)}
    {...props}
  />
))
MemberListInfo.displayName = "MemberListInfo"

export interface MemberListNameProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /** Render the name in the brand colour (e.g. highlighted role). */
  colored?: boolean
  /** Role colour. Any CSS colour; wins over `colored`. */
  color?: string
}

const MemberListName = React.forwardRef<HTMLSpanElement, MemberListNameProps>(
  ({ className, colored = false, color, style, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="member-name"
      /*
       * SAFETY: `CSSProperties` has no index signature for custom properties,
       * but React forwards unknown `--*` keys to the style attribute verbatim,
       * so the extra key is written out exactly as spelled here.
       */
      style={
        color
          ? ({
              ...style,
              "--newt-member-name-color": color,
            } as React.CSSProperties)
          : style
      }
      className={cn(
        "truncate text-sm font-medium",
        color
          ? "text-[var(--newt-member-name-color)]"
          : colored
            ? "text-newt-brand"
            : "text-newt-text-primary",
        className
      )}
      {...props}
    />
  )
)
MemberListName.displayName = "MemberListName"

/* The APP tag bots carry next to their name; `verified` adds Discord's check. */
export interface MemberListAppTagProps extends React.HTMLAttributes<HTMLSpanElement> {
  verified?: boolean
}

const MemberListAppTag = React.forwardRef<
  HTMLSpanElement,
  MemberListAppTagProps
>(({ className, verified = false, children = "APP", ...props }, ref) => (
  <span
    ref={ref}
    role="img"
    aria-label={verified ? "Verified application" : "Application"}
    className={cn(
      "inline-flex shrink-0 items-center gap-0.5 rounded-sm bg-newt-brand px-1 py-px text-[9px] font-bold leading-none text-white",
      className
    )}
    {...props}
  >
    {verified ? (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        className="h-2.5 w-2.5"
      >
        <path
          fill="currentColor"
          d="M9.55 17.6 4.4 12.45l1.4-1.4 3.75 3.75 8.65-8.65 1.4 1.4z"
        />
      </svg>
    ) : null}
    {children}
  </span>
))
MemberListAppTag.displayName = "MemberListAppTag"

const MemberListRole = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("truncate text-xs text-newt-text-muted", className)}
    {...props}
  />
))
MemberListRole.displayName = "MemberListRole"

export {
  MemberList,
  MemberListSection,
  MemberListHeading,
  MemberListItem,
  MemberListInfo,
  MemberListNameRow,
  MemberListName,
  MemberListAppTag,
  MemberListRole,
}
