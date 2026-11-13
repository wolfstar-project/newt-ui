"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Radix owns the behaviour: it opens at the pointer on a right click, a long
 * press or the menu key, and handles Escape and outside press, arrow keys,
 * Home and End, typeahead, and focus return. Only the look is newt/ui's.
 */
const ContextMenu = ContextMenuPrimitive.Root

/*
 * The area that answers the right click. It renders a `span` with no look of
 * its own; pass `asChild` to put it on your own element.
 */
const ContextMenuTrigger = ContextMenuPrimitive.Trigger

const ContextMenuGroup = ContextMenuPrimitive.Group

const ContextMenuContent = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content> & {
    /**
     * The element the menu is portalled into. Defaults to `document.body`;
     * pass the enclosing native `<dialog>` or a themed wrapper to keep it there.
     */
    container?: React.ComponentProps<
      typeof ContextMenuPrimitive.Portal
    >["container"]
  }
>(({ className, container, ...props }, ref) => (
  <ContextMenuPrimitive.Portal container={container}>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        "z-[110] w-[188px] rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high outline-none",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = "ContextMenuContent"

/*
 * `data-highlighted` is the primitive's one state for the pointer and the
 * keyboard, so it takes the place of the old `:hover` rule.
 */
const contextMenuItemVariants = cva(
  "group flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-[13px] outline-none transition-colors duration-fast ease-newt data-[highlighted]:text-newt-on-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "text-newt-text-secondary data-[highlighted]:bg-newt-brand",
        danger: "text-newt-dnd data-[highlighted]:bg-newt-dnd",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ContextMenuItemProps
  extends
    React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item>,
    VariantProps<typeof contextMenuItemVariants> {}

const ContextMenuItem = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Item>,
  ContextMenuItemProps
>(({ className, variant, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(contextMenuItemVariants({ variant }), className)}
    {...props}
  />
))
ContextMenuItem.displayName = "ContextMenuItem"

const ContextMenuLabel = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = "ContextMenuLabel"

const ContextMenuShortcut = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-[11px] text-newt-text-muted group-data-[highlighted]:text-[color-mix(in_srgb,var(--newt-on-accent)_70%,transparent)]",
      className
    )}
    {...props}
  />
))
ContextMenuShortcut.displayName = "ContextMenuShortcut"

const ContextMenuSeparator = React.forwardRef<
  React.ComponentRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    className={cn("mx-1.5 my-1 h-px bg-newt-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = "ContextMenuSeparator"

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuSeparator,
  contextMenuItemVariants,
}
