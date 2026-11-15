"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The composition:
 *
 *   MemberListSection          <section>
 *     MemberListHeading        <h3 id>
 *     MemberList               role="list", aria-labelledby the heading
 *       MemberListItem         role="listitem"
 *
 * A heading is never a child of the list, which may own only list items.
 * The section generates one id, the heading takes it and the list points at
 * it, so each list is named by its heading. A list outside a section takes
 * an `aria-label` instead.
 */
const MemberListSectionContext = React.createContext<string | undefined>(
  undefined
)

const MemberList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(
  (
    {
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      ...props
    },
    ref
  ) => {
    const headingId = React.useContext(MemberListSectionContext)
    return (
      <div
        ref={ref}
        role="list"
        aria-label={ariaLabel}
        aria-labelledby={
          ariaLabelledby ?? (ariaLabel === undefined ? headingId : undefined)
        }
        className={cn("flex flex-col", className)}
        {...props}
      />
    )
  }
)
MemberList.displayName = "MemberList"

/*
 * Discord groups members under each hoisted role, then Online, then Offline.
 * `offline` dims the whole group rather than every row on its own.
 */
export interface MemberListSectionProps extends React.HTMLAttributes<HTMLElement> {
  offline?: boolean
}

const MemberListSection = React.forwardRef<HTMLElement, MemberListSectionProps>(
  ({ className, offline = false, ...props }, ref) => {
    const headingId = React.useId()
    return (
      <MemberListSectionContext.Provider value={headingId}>
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
      </MemberListSectionContext.Provider>
    )
  }
)
MemberListSection.displayName = "MemberListSection"

export interface MemberListHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** The heading level. Pick the one that fits the outline of the page. */
  as?: "h2" | "h3" | "h4" | "h5" | "h6"
}

/*
 * Inside a section the heading takes the id the section generated, so the
 * list beside it is named by it. If you pass an `id` of your own, pass the
 * same id as `aria-labelledby` on the `MemberList`.
 */
const MemberListHeading = React.forwardRef<
  HTMLHeadingElement,
  MemberListHeadingProps
>(({ className, as: Heading = "h3", id, ...props }, ref) => {
  const headingId = React.useContext(MemberListSectionContext)
  return (
    <Heading
      ref={ref}
      id={id ?? headingId}
      className={cn(
        "m-0 px-2 pb-0.5 text-[12px] font-semibold uppercase leading-4 tracking-[0.02em] text-newt-text-muted",
        className
      )}
      {...props}
    />
  )
})
MemberListHeading.displayName = "MemberListHeading"

export interface MemberListItemProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Make the row a button, for a row that opens a profile. It takes focus,
   * answers Enter and Space, and shows a hover and a focus ring. Every
   * attribute and listener, and the ref, land on the button.
   */
  interactive?: boolean
  /**
   * An underlay drawn behind the row, such as a profile decoration. The hover
   * is drawn over it, so it stays visible. An `img` fills the row.
   */
  decoration?: React.ReactNode
}

const MEMBER_ROW =
  "relative isolate flex min-w-0 items-center gap-2.5 rounded-sm px-2 py-1.5"
const MEMBER_ROW_INTERACTIVE =
  "w-full cursor-pointer border-0 bg-transparent text-start after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:transition-colors after:duration-fast after:ease-newt after:content-[''] hover:after:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link"

/*
 * One member. A plain row has no pointer and no hover, because it does
 * nothing. With `interactive` the row is a button inside the list item.
 */
const MemberListItem = React.forwardRef<HTMLElement, MemberListItemProps>(
  ({ className, interactive = false, decoration, children, ...props }, ref) => {
    /*
     * `createElement` types the ref by the element it is given, so one
     * `HTMLElement` ref serves the `div` and the `button` without an
     * assertion.
     */
    const row = React.createElement(
      interactive ? "button" : "div",
      {
        ref,
        type: interactive ? "button" : undefined,
        role: interactive ? undefined : "listitem",
        className: cn(
          MEMBER_ROW,
          interactive && MEMBER_ROW_INTERACTIVE,
          className
        ),
        ...props,
      },
      decoration === undefined ? null : (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit] [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
        >
          {decoration}
        </span>
      ),
      children
    )
    return interactive ? <div role="listitem">{row}</div> : row
  }
)
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
  /** Accessible name of the tag. `aria-label` still wins. */
  label?: string
  /** Accessible name with `verified`. `aria-label` still wins. */
  verifiedLabel?: string
}

const MemberListAppTag = React.forwardRef<
  HTMLSpanElement,
  MemberListAppTagProps
>(
  (
    {
      className,
      verified = false,
      label = "Application",
      verifiedLabel = "Verified application",
      children = "APP",
      ...props
    },
    ref
  ) => (
    <span
      ref={ref}
      role="img"
      aria-label={verified ? verifiedLabel : label}
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 rounded-sm bg-newt-brand px-1 py-px text-[9px] font-bold leading-none text-newt-on-accent",
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
  )
)
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
