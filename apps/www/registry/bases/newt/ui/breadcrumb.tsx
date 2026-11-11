import * as React from "react"

import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.ComponentProps<"nav"> {
  /** Accessible name of the landmark. */
  label?: string
}

/*
 * Where the page sits, as an ordered list inside a named `<nav>`. The
 * separator is drawn by the stylesheet, so it is never read out and never
 * copied with the text; a slash reads the same in either direction.
 */
const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, label = "Breadcrumb", children, ...props }, ref) => (
    <nav ref={ref} aria-label={label} className={className} {...props}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm leading-5">
        {children}
      </ol>
    </nav>
  )
)
Breadcrumb.displayName = "Breadcrumb"

export interface BreadcrumbItemProps extends React.ComponentProps<"li"> {
  /** Where this level leads. Omit it to pass a router link as the child. */
  href?: string
  /** Marks the page the reader is on; it is text, not a link. */
  current?: boolean
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, href, current = false, children, ...props }, ref) => (
    <li
      ref={ref}
      className={cn(
        // A router's own link, passed as the child, is styled from here.
        "inline-flex min-w-0 items-center gap-1.5 text-newt-text-secondary [&:not(:first-child)]:before:text-newt-text-muted [&:not(:first-child)]:before:content-['/'] [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-newt-text-link [&_a:hover]:text-newt-text-primary [&_a:hover]:underline [&_a]:rounded-sm [&_a]:text-newt-text-secondary [&_a]:no-underline [&_a]:transition-colors [&_a]:duration-fast [&_a]:ease-newt",
        className
      )}
      {...props}
    >
      {current ? (
        <span
          aria-current="page"
          className="truncate font-semibold text-newt-text-primary"
        >
          {children}
        </span>
      ) : href === undefined ? (
        children
      ) : (
        <a href={href}>{children}</a>
      )}
    </li>
  )
)
BreadcrumbItem.displayName = "BreadcrumbItem"

export { Breadcrumb, BreadcrumbItem }
