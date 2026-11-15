import * as React from "react"

import { cn } from "@/lib/utils"

export interface ChannelHeaderProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The element to render. `div` by default, because a `header` outside
   * `main`, `article`, `aside`, `nav` or `section` is a second banner
   * landmark. Pass `header` when the bar sits inside one of those.
   */
  as?: React.ElementType
}

/* The bar above the message list: channel name, topic, and channel actions. */
const ChannelHeader = React.forwardRef<HTMLElement, ChannelHeaderProps>(
  ({ as: Tag = "div", className, ...props }, ref) => (
    <Tag
      ref={ref}
      className={cn(
        "flex min-h-12 items-center justify-between gap-3 border-b border-newt-border bg-newt-bg-surface ps-4 pe-3 text-newt-text-primary",
        className
      )}
      {...props}
    />
  )
)
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
      "min-w-0 truncate text-base font-semibold text-newt-text-primary",
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

/*
 * The shrink factor is what makes the topic give way before the name: the
 * name only starts to truncate once the topic has no width left.
 */
const ChannelHeaderTopic = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "min-w-0 shrink-[99999] truncate text-[13px] font-medium text-newt-text-muted",
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

/* What every control of the header adds to its resting look. */
const interactiveClassName =
  "cursor-pointer transition-colors aria-disabled:pointer-events-none duration-fast ease-newt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"

interface ChannelHeaderControlProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The element or component to render. Defaults to `button`, or to `a` when
   * `href` is set; pass a router link component to keep client navigation.
   * `span` renders the decorative form: hidden from assistive technology, out
   * of the tab order, with no pointer and no hover.
   */
  as?: React.ElementType
  /** Render a link to this URL. */
  href?: string
  /**
   * Turns the control off. A link loses its URL, which takes it out of the
   * tab order, and says so with `aria-disabled`.
   */
  disabled?: boolean
  /** Link target, with `href`. */
  target?: React.AnchorHTMLAttributes<HTMLAnchorElement>["target"]
  /** Link relationship, with `href`. */
  rel?: string
}

/* The element a control renders, and whether it is the decorative form. */
function resolveControl(
  as: React.ElementType | undefined,
  href: string | undefined
) {
  const Tag: React.ElementType = as ?? (href === undefined ? "button" : "a")
  return { Tag, isButton: Tag === "button", decorative: Tag === "span" }
}

export interface ChannelHeaderActionProps extends ChannelHeaderControlProps {
  /**
   * Makes the action a toggle and keeps it lit up while `true`. A button
   * reports the value as `aria-pressed`; leave it unset for a plain action.
   */
  active?: boolean
}

const ChannelHeaderAction = React.forwardRef<
  HTMLElement,
  ChannelHeaderActionProps
>(
  (
    { as, href, disabled, className, active, type = "button", ...props },
    ref
  ) => {
    const { Tag, isButton, decorative } = resolveControl(as, href)
    return (
      <Tag
        ref={ref}
        type={isButton ? type : undefined}
        href={decorative || disabled ? undefined : href}
        disabled={isButton ? disabled : undefined}
        aria-disabled={!isButton && !decorative && disabled ? true : undefined}
        aria-hidden={decorative ? true : undefined}
        aria-pressed={isButton ? active : undefined}
        data-state={active ? "active" : "inactive"}
        className={cn(
          "inline-flex h-6 w-6 shrink-0 items-center justify-center border-0 bg-transparent p-0 text-newt-text-muted data-[state=active]:text-newt-text-primary",
          !decorative && [interactiveClassName, "hover:text-newt-text-primary"],
          className
        )}
        {...props}
      />
    )
  }
)
ChannelHeaderAction.displayName = "ChannelHeaderAction"

const SearchIcon = ({ className }: { className: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    aria-hidden="true"
    className={cn("shrink-0", className)}
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="M10.5 10.5 14 14" />
  </svg>
)

export interface ChannelHeaderSearchProps extends ChannelHeaderControlProps {
  /** The text shown when the control has no children. */
  placeholder?: string
  /**
   * Icon-only form for the narrow header. The text stays in the control for
   * assistive technology, so it is still the accessible name.
   */
  compact?: boolean
}

/* Its text is its accessible name: what a user sees is what they can say. */
const ChannelHeaderSearch = React.forwardRef<
  HTMLElement,
  ChannelHeaderSearchProps
>(
  (
    {
      as,
      href,
      disabled,
      className,
      placeholder = "Search",
      compact = false,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    const { Tag, isButton, decorative } = resolveControl(as, href)
    return (
      <Tag
        ref={ref}
        type={isButton ? type : undefined}
        href={decorative || disabled ? undefined : href}
        disabled={isButton ? disabled : undefined}
        aria-disabled={!isButton && !decorative && disabled ? true : undefined}
        aria-hidden={decorative ? true : undefined}
        className={cn(
          "flex shrink-0 items-center text-newt-text-muted no-underline",
          compact
            ? "h-6 w-6 justify-center border-0 bg-transparent p-0"
            : "h-7 w-60 justify-between gap-3 rounded-[var(--newt-radius-sm)] border border-newt-border bg-newt-bg-input px-2",
          !decorative && [
            interactiveClassName,
            compact
              ? "hover:text-newt-text-primary"
              : "hover:border-newt-text-muted",
          ],
          className
        )}
        {...props}
      >
        <span
          className={
            compact
              ? "sr-only"
              : "min-w-0 flex-1 truncate text-start text-sm font-medium leading-none"
          }
        >
          {children ?? placeholder}
        </span>
        <SearchIcon className={compact ? "h-5 w-5" : "h-4 w-4"} />
      </Tag>
    )
  }
)
ChannelHeaderSearch.displayName = "ChannelHeaderSearch"

export interface ChannelHeaderBackProps extends ChannelHeaderControlProps {
  /** The unread count drawn beside the arrow. Leave it unset for no badge. */
  badge?: React.ReactNode
}

/*
 * The control that leaves the channel in the narrow header. It has no text,
 * so it needs an `aria-label`; put the unread count in that label too,
 * because the label replaces the badge for assistive technology.
 */
const ChannelHeaderBack = React.forwardRef<HTMLElement, ChannelHeaderBackProps>(
  (
    {
      as,
      href,
      disabled,
      className,
      badge,
      type = "button",
      children,
      ...props
    },
    ref
  ) => {
    const { Tag, isButton, decorative } = resolveControl(as, href)
    return (
      <Tag
        ref={ref}
        type={isButton ? type : undefined}
        href={decorative || disabled ? undefined : href}
        disabled={isButton ? disabled : undefined}
        aria-disabled={!isButton && !decorative && disabled ? true : undefined}
        aria-hidden={decorative ? true : undefined}
        className={cn(
          "inline-flex h-6 min-w-6 shrink-0 items-center justify-center gap-1 border-0 bg-transparent p-0 text-newt-text-muted no-underline",
          !decorative && [interactiveClassName, "hover:text-newt-text-primary"],
          className
        )}
        {...props}
      >
        {children ?? (
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-5 w-5 shrink-0 rtl:-scale-x-100"
          >
            <path d="M8.7 3.3 2 10l6.7 6.7 1.4-1.4L5.8 11H18V9H5.8l4.3-4.3-1.4-1.4Z" />
          </svg>
        )}
        {badge == null || badge === false ? null : (
          <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-newt-dnd px-1 text-[11px] font-bold leading-none text-newt-on-accent">
            {badge}
          </span>
        )}
      </Tag>
    )
  }
)
ChannelHeaderBack.displayName = "ChannelHeaderBack"

/*
 * The channel name as a control, for the narrow header where a press on the
 * title opens the channel details. Put `ChannelHeaderIcon` and
 * `ChannelHeaderName` inside it: the name is its accessible name. `span`
 * renders it as plain text, still readable by assistive technology.
 */
const ChannelHeaderTitle = React.forwardRef<
  HTMLElement,
  ChannelHeaderControlProps
>(
  (
    { as, href, disabled, className, type = "button", children, ...props },
    ref
  ) => {
    const { Tag, isButton, decorative: plain } = resolveControl(as, href)
    return (
      <Tag
        ref={ref}
        type={isButton ? type : undefined}
        href={plain || disabled ? undefined : href}
        disabled={isButton ? disabled : undefined}
        aria-disabled={!isButton && !plain && disabled ? true : undefined}
        className={cn(
          "inline-flex min-w-0 items-center gap-2 rounded-[var(--newt-radius-sm)] border-0 bg-transparent px-1.5 py-1 text-start text-newt-text-primary no-underline",
          !plain && [interactiveClassName, "hover:bg-newt-bg-hover"],
          className
        )}
        {...props}
      >
        {children}
        {plain ? null : (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-newt-text-muted rtl:-scale-x-100"
          >
            <path d="m6 3.5 4.5 4.5L6 12.5" />
          </svg>
        )}
      </Tag>
    )
  }
)
ChannelHeaderTitle.displayName = "ChannelHeaderTitle"

/* Compact "N Online" readout used by the narrow layout of the header. */
const ChannelHeaderOnline = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex shrink-0 items-center gap-1.5 text-xs text-newt-text-muted",
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
  ChannelHeaderBack,
  ChannelHeaderTitle,
  ChannelHeaderOnline,
}
