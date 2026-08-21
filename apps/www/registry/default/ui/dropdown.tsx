import * as React from "react"

import { cn } from "@/lib/utils"

const Dropdown = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="menu"
    className={cn(
      "w-60 rounded-md border border-newt-border bg-[var(--newt-bg-floating)] p-1.5 text-newt-text-primary shadow-elevation-high",
      className
    )}
    {...props}
  />
))
Dropdown.displayName = "Dropdown"

export interface DropdownItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Highlights the item as if hovered (e.g. keyboard focus / selected). */
  active?: boolean
}

const DropdownItem = React.forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ className, active = false, ...props }, ref) => (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={-1}
      data-active={active ? "" : undefined}
      className={cn(
        "group flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 transition-colors duration-fast ease-newt hover:bg-newt-brand data-[active]:bg-newt-brand",
        className
      )}
      {...props}
    />
  )
)
DropdownItem.displayName = "DropdownItem"

const DropdownIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "w-5 shrink-0 text-center text-newt-text-muted group-hover:text-white group-data-[active]:text-white",
      className
    )}
    {...props}
  />
))
DropdownIcon.displayName = "DropdownIcon"

const DropdownContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0", className)} {...props} />
))
DropdownContent.displayName = "DropdownContent"

const DropdownLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm font-medium", className)} {...props} />
))
DropdownLabel.displayName = "DropdownLabel"

const DropdownDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xs text-newt-text-muted group-hover:text-white/75 group-data-[active]:text-white/75",
      className
    )}
    {...props}
  />
))
DropdownDescription.displayName = "DropdownDescription"

const DropdownDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("mx-1.5 my-1 h-px bg-newt-border", className)}
    {...props}
  />
))
DropdownDivider.displayName = "DropdownDivider"

export {
  Dropdown,
  DropdownItem,
  DropdownIcon,
  DropdownContent,
  DropdownLabel,
  DropdownDescription,
  DropdownDivider,
}
