"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Radix owns the behaviour: open state, Escape and outside press, focus
 * return to the trigger, arrow keys, Home and End, typeahead, and
 * collision-aware placement. Only the look is newt/ui's.
 */
const Dropdown = DropdownMenuPrimitive.Root

/*
 * It has no look of its own. Pass `asChild` to put the state on your own
 * button, or the classes of the button it should be, for example
 * `className={buttonVariants({ variant: "secondary" })}`.
 */
const DropdownTrigger = DropdownMenuPrimitive.Trigger

const DropdownGroup = DropdownMenuPrimitive.Group

const DropdownRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownContent = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
    /**
     * The element the menu is portalled into. Defaults to `document.body`;
     * pass the enclosing native `<dialog>` or a themed wrapper to keep it there.
     */
    container?: React.ComponentProps<
      typeof DropdownMenuPrimitive.Portal
    >["container"]
  }
>(
  (
    { className, align = "start", sideOffset = 4, container, ...props },
    ref
  ) => (
    <DropdownMenuPrimitive.Portal container={container}>
      <DropdownMenuPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "z-[110] w-60 rounded-md border border-newt-border bg-newt-bg-floating p-1.5 text-newt-text-primary shadow-elevation-high outline-none",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
)
DropdownContent.displayName = "DropdownContent"

/*
 * `data-highlighted` is the primitive's one state for the pointer and the
 * keyboard, so it takes the place of the old `:hover` rule.
 */
const dropdownItemVariants = cva(
  "group flex cursor-pointer select-none items-center gap-2.5 rounded-sm px-2.5 py-2 outline-none transition-colors duration-fast ease-newt data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[highlighted]:bg-newt-brand",
        danger:
          "text-newt-danger data-[highlighted]:bg-newt-danger data-[highlighted]:text-newt-on-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface DropdownItemProps
  extends
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>,
    VariantProps<typeof dropdownItemVariants> {}

const DropdownItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Item>,
  DropdownItemProps
>(({ className, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(dropdownItemVariants({ variant }), className)}
    {...props}
  />
))
DropdownItem.displayName = "DropdownItem"

export interface DropdownRadioItemProps
  extends
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>,
    VariantProps<typeof dropdownItemVariants> {}

/*
 * The checked item keeps the brand fill, so the highlight on it is an inset
 * outline: without it the keyboard position is lost on the chosen item.
 */
const DropdownRadioItem = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
  DropdownRadioItemProps
>(({ className, variant, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      dropdownItemVariants({ variant }),
      "data-[state=checked]:bg-newt-brand",
      "data-[state=checked]:data-[highlighted]:outline data-[state=checked]:data-[highlighted]:outline-2 data-[state=checked]:data-[highlighted]:-outline-offset-2 data-[state=checked]:data-[highlighted]:outline-newt-on-accent",
      className
    )}
    {...props}
  />
))
DropdownRadioItem.displayName = "DropdownRadioItem"

const DropdownLabel = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2.5 py-1.5 text-xs font-bold uppercase tracking-[0.02em] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
DropdownLabel.displayName = "DropdownLabel"

const DropdownSeparator = React.forwardRef<
  React.ComponentRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("mx-1.5 my-1 h-px bg-newt-border", className)}
    {...props}
  />
))
DropdownSeparator.displayName = "DropdownSeparator"

const DropdownIcon = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn(
      "w-5 shrink-0 text-center text-newt-text-muted group-data-[highlighted]:text-newt-on-accent group-data-[state=checked]:text-newt-on-accent",
      className
    )}
    {...props}
  />
))
DropdownIcon.displayName = "DropdownIcon"

const DropdownItemText = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("min-w-0", className)} {...props} />
))
DropdownItemText.displayName = "DropdownItemText"

const DropdownItemLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm font-medium", className)} {...props} />
))
DropdownItemLabel.displayName = "DropdownItemLabel"

const DropdownItemDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-xs text-newt-text-muted group-data-[highlighted]:text-[color-mix(in_srgb,var(--newt-on-accent)_75%,transparent)] group-data-[state=checked]:text-[color-mix(in_srgb,var(--newt-on-accent)_75%,transparent)]",
      className
    )}
    {...props}
  />
))
DropdownItemDescription.displayName = "DropdownItemDescription"

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownGroup,
  DropdownLabel,
  DropdownItem,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownIcon,
  DropdownItemText,
  DropdownItemLabel,
  DropdownItemDescription,
  dropdownItemVariants,
}
