import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const Pagination = React.forwardRef<HTMLElement, React.ComponentProps<"nav">>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
)
Pagination.displayName = "Pagination"

const paginationButtonVariants = cva(
  "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-sm border px-2 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      active: {
        false:
          "border-newt-border bg-newt-bg-elevated text-newt-text-secondary hover:bg-newt-bg-hover hover:text-newt-text-primary",
        true: "border-newt-brand bg-newt-brand text-white",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export interface PaginationButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof paginationButtonVariants> {}

const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  PaginationButtonProps
>(({ className, active, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-current={active ? "page" : undefined}
    data-active={active ? "" : undefined}
    className={cn(paginationButtonVariants({ active }), className)}
    {...props}
  />
))
PaginationButton.displayName = "PaginationButton"

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("px-1 text-[13px] text-newt-text-muted", className)}
    {...props}
  >
    {children ?? "…"}
  </span>
))
PaginationEllipsis.displayName = "PaginationEllipsis"

/** A "load more" row: centred content flanked by hairline rules. */
const LoadMore = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-2.5 p-3 text-[13px] text-newt-text-muted before:h-px before:flex-1 before:bg-newt-border before:content-[''] after:h-px after:flex-1 after:bg-newt-border after:content-['']",
        className
      )}
      {...props}
    />
  )
)
LoadMore.displayName = "LoadMore"

export {
  Pagination,
  PaginationButton,
  PaginationEllipsis,
  LoadMore,
  paginationButtonVariants,
}
