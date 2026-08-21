import * as React from "react"

import { cn } from "@/lib/utils"

const SelectMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="listbox"
    className={cn(
      "max-h-80 min-w-[200px] overflow-y-auto rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high",
      className
    )}
    {...props}
  />
))
SelectMenu.displayName = "SelectMenu"

const SelectMenuSearch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { wrapperClassName?: string }
>(({ className, wrapperClassName, type = "text", ...props }, ref) => (
  <div
    className={cn(
      "mb-1 flex items-center gap-2 rounded-sm bg-newt-bg-base px-2.5 py-1.5",
      wrapperClassName
    )}
  >
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full border-0 bg-transparent font-sans text-sm text-newt-text-primary outline-none placeholder:text-newt-text-muted",
        className
      )}
      {...props}
    />
  </div>
))
SelectMenuSearch.displayName = "SelectMenuSearch"

const SelectMenuLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "px-2.5 pb-0.5 pt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
SelectMenuLabel.displayName = "SelectMenuLabel"

export interface SelectMenuOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  selected?: boolean
}

const SelectMenuOption = React.forwardRef<
  HTMLDivElement,
  SelectMenuOptionProps
>(({ className, selected = false, ...props }, ref) => (
  <div
    ref={ref}
    role="option"
    aria-selected={selected}
    data-state={selected ? "selected" : "unselected"}
    className={cn(
      "flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-newt-text-secondary hover:bg-newt-brand hover:text-white",
      selected &&
        "text-newt-text-primary after:ml-auto after:font-bold after:text-newt-brand after:content-['\\2713'] hover:after:text-white",
      className
    )}
    {...props}
  />
))
SelectMenuOption.displayName = "SelectMenuOption"

const SelectMenuDivider = React.forwardRef<
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
SelectMenuDivider.displayName = "SelectMenuDivider"

export {
  SelectMenu,
  SelectMenuSearch,
  SelectMenuLabel,
  SelectMenuOption,
  SelectMenuDivider,
}
