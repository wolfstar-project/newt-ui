"use client"

import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A radio group: one choice out of a short, visible list. Where a select menu
 * hides its options until asked, this shows them all, which is what the
 * client's settings panels use when there are two or three of them and the
 * difference between them matters.
 *
 * Radix owns the behaviour: the value, the single tab stop, the arrow keys
 * and the hidden input a form reads. Only the look is newt/ui's.
 */
const RadioGroup = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    /** Accessible name for the group. */
    label?: string
  }
>(({ className, label, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    aria-label={label}
    className={cn("flex flex-col gap-1", className)}
    {...props}
  />
))
RadioGroup.displayName = "RadioGroup"

const Radio = React.forwardRef<
  React.ComponentRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    /** A second line, when the choice needs a sentence to explain it. */
    description?: React.ReactNode
  }
>(({ className, description, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "group flex cursor-pointer items-center gap-3 border-0 bg-transparent px-1 py-2 text-start font-sans text-[15px] leading-5 text-newt-text-secondary",
      "hover:text-newt-text-primary focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
      "data-[state=checked]:text-newt-text-primary",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {/*
     * The indicator stays mounted so it can be the ring as well as the dot:
     * it carries `data-state`, and the dot grows from nothing.
     */}
    <RadioGroupPrimitive.Indicator
      forceMount
      aria-hidden="true"
      className={cn(
        "relative h-5 w-5 shrink-0 rounded-full border-2 border-newt-text-muted transition-colors duration-fast ease-newt",
        "after:absolute after:top-1/2 after:start-1/2 after:h-2 after:w-2 after:rounded-full after:bg-newt-on-accent after:content-['']",
        // Centring, and the dot's grow: both carry the writing direction.
        "after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(0)]",
        "data-[state=checked]:border-newt-brand data-[state=checked]:bg-newt-brand",
        "data-[state=checked]:after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(1)]",
        "group-hover:border-newt-text-secondary",
        // A disabled row does not answer the pointer, checked or not.
        "data-[disabled]:data-[state=unchecked]:group-hover:border-newt-text-muted data-[disabled]:data-[state=checked]:group-hover:border-newt-brand"
      )}
    />
    {description === undefined ? (
      children
    ) : (
      <span className="flex min-w-0 flex-col gap-0.5">
        <span>{children}</span>
        <span className="text-[13px] leading-[17px] text-newt-text-muted">
          {description}
        </span>
      </span>
    )}
  </RadioGroupPrimitive.Item>
))
Radio.displayName = "Radio"

export { Radio, RadioGroup }
