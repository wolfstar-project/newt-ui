import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The vertical list of sections down the side of a settings screen: a named
 * `<nav>` of groups. Pass `aria-label` to say what it navigates.
 */
const SideNav = React.forwardRef<HTMLElement, React.ComponentProps<"nav">>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
)
SideNav.displayName = "SideNav"

export interface SideNavGroupProps extends React.ComponentProps<"div"> {
  /** The small heading over the group. Omit it for an unlabelled group. */
  label?: string
}

const SideNavGroup = React.forwardRef<HTMLDivElement, SideNavGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    const id = React.useId()
    return (
      <div
        ref={ref}
        className={cn(
          "border-newt-border py-2 [&:not(:first-child)]:border-t",
          className
        )}
        {...props}
      >
        {label === undefined ? null : (
          <div
            id={id}
            className="px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted"
          >
            {label}
          </div>
        )}
        <ul
          aria-labelledby={label === undefined ? undefined : id}
          className="m-0 flex list-none flex-col gap-0.5 p-0"
        >
          {children}
        </ul>
      </div>
    )
  }
)
SideNavGroup.displayName = "SideNavGroup"

export interface SideNavItemProps extends React.HTMLAttributes<HTMLElement> {
  /** Makes the entry a link. Without it the entry is a button. */
  href?: string
  /** Marks the section being shown. */
  current?: boolean
  /** `danger` is for an entry that destroys something. */
  variant?: "default" | "danger"
  /** A count shown at the end of the entry. */
  badge?: number
  /** For a link: where it opens, and its relationship to the page. */
  target?: string
  rel?: string
  /** For a button. */
  disabled?: boolean
}

/*
 * One entry. `className` lands on the list item; every other attribute and
 * listener lands on the link or the button inside it, which is where a
 * `target`, a `disabled` or an `onClick` belongs.
 */
const SideNavItem = React.forwardRef<HTMLLIElement, SideNavItemProps>(
  (
    {
      className,
      href,
      current = false,
      variant = "default",
      badge,
      target,
      rel,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const itemClassName = cn(
      "flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-start font-sans text-[15px] font-medium leading-5 no-underline transition-colors duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50 aria-[current=page]:bg-newt-bg-active",
      variant === "danger"
        ? "text-newt-danger"
        : "text-newt-text-secondary hover:text-newt-text-primary aria-[current=page]:text-newt-text-primary"
    )
    const content = (
      <>
        {children}
        {badge === undefined ? null : (
          <span className="min-w-4 rounded-full bg-newt-danger px-[5px] text-center text-[11px] font-bold leading-4 text-newt-on-accent">
            {badge}
          </span>
        )}
      </>
    )
    return (
      <li ref={ref} className={className}>
        {href === undefined ? (
          <button
            type="button"
            disabled={disabled}
            aria-current={current ? "page" : undefined}
            className={itemClassName}
            {...props}
          >
            {content}
          </button>
        ) : (
          <a
            href={href}
            target={target}
            rel={rel}
            aria-current={current ? "page" : undefined}
            className={itemClassName}
            {...props}
          >
            {content}
          </a>
        )}
      </li>
    )
  }
)
SideNavItem.displayName = "SideNavItem"

export { SideNav, SideNavGroup, SideNavItem }
