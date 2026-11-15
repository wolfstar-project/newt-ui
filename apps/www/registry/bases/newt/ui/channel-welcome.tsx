import * as React from "react"

import { cn } from "@/lib/utils"

/* The header that opens a channel, shown above its very first message. */
const ChannelWelcome = React.forwardRef<
  HTMLElement,
  React.ComponentProps<"section">
>(({ className, ...props }, ref) => (
  <section ref={ref} className={cn("px-4 pb-2 pt-10", className)} {...props} />
))
ChannelWelcome.displayName = "ChannelWelcome"

const ChannelWelcomeIcon = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children = "#", ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "mb-4 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-newt-bg-elevated text-[32px] font-bold leading-none text-newt-text-primary",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
ChannelWelcomeIcon.displayName = "ChannelWelcomeIcon"

const ChannelWelcomeTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentProps<"h2">
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "text-[28px] font-bold leading-tight text-newt-text-primary",
      className
    )}
    {...props}
  />
))
ChannelWelcomeTitle.displayName = "ChannelWelcomeTitle"

const ChannelWelcomeDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-2 text-base text-newt-text-muted", className)}
    {...props}
  />
))
ChannelWelcomeDescription.displayName = "ChannelWelcomeDescription"

export interface ChannelWelcomeActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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

const ChannelWelcomeAction = React.forwardRef<
  HTMLElement,
  ChannelWelcomeActionProps
>(({ as, href, disabled, className, type = "button", ...props }, ref) => {
  const Tag: React.ElementType = as ?? (href === undefined ? "button" : "a")
  const isButton = Tag === "button"
  const decorative = Tag === "span"
  return (
    <Tag
      ref={ref}
      type={isButton ? type : undefined}
      href={decorative || disabled ? undefined : href}
      disabled={isButton ? disabled : undefined}
      aria-disabled={!isButton && !decorative && disabled ? true : undefined}
      aria-hidden={decorative ? true : undefined}
      className={cn(
        "mt-3 inline-flex items-center gap-2 rounded-[var(--newt-radius-sm)] border-0 bg-newt-bg-elevated px-4 py-1.5 text-sm font-medium text-newt-text-primary no-underline",
        !decorative &&
          "cursor-pointer transition-colors aria-disabled:pointer-events-none duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
        className
      )}
      {...props}
    />
  )
})
ChannelWelcomeAction.displayName = "ChannelWelcomeAction"

export interface ChannelWelcomeDateProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Machine-readable date for the rendered `<time>` element. */
  dateTime?: string
  children?: React.ReactNode
}

/* Creation date, centred between two hairlines. */
const ChannelWelcomeDate = React.forwardRef<
  HTMLDivElement,
  ChannelWelcomeDateProps
>(({ className, dateTime, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-newt-text-muted",
      "[&>span]:h-px [&>span]:bg-newt-border",
      className
    )}
    {...props}
  >
    <span aria-hidden="true" />
    <time dateTime={dateTime}>{children}</time>
    <span aria-hidden="true" />
  </div>
))
ChannelWelcomeDate.displayName = "ChannelWelcomeDate"

export {
  ChannelWelcome,
  ChannelWelcomeIcon,
  ChannelWelcomeTitle,
  ChannelWelcomeDescription,
  ChannelWelcomeAction,
  ChannelWelcomeDate,
}
