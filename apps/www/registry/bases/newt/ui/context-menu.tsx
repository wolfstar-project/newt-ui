import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const ContextMenu = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="menu"
    className={cn(
      "w-[188px] rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high",
      className
    )}
    {...props}
  />
))
ContextMenu.displayName = "ContextMenu"

const contextMenuItemVariants = cva(
  "group flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-[13px] transition-colors duration-fast ease-newt hover:text-white",
  {
    variants: {
      variant: {
        default: "text-newt-text-secondary hover:bg-newt-brand",
        danger: "text-newt-dnd hover:bg-newt-dnd",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ContextMenuItemProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof contextMenuItemVariants> {}

const ContextMenuItem = React.forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="menuitem"
      tabIndex={-1}
      className={cn(contextMenuItemVariants({ variant }), className)}
      {...props}
    />
  )
)
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-[11px] text-newt-text-muted group-hover:text-white/70",
      className
    )}
    {...props}
  />
))
ContextMenuShortcut.displayName = "ContextMenuShortcut"

const ContextMenuDivider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn("mx-1.5 my-1 h-px bg-newt-border", className)}
    {...props}
  />
))
ContextMenuDivider.displayName = "ContextMenuDivider"

export {
  ContextMenu,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuDivider,
  contextMenuItemVariants,
}
