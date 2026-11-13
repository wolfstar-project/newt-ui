"use client"

import { Accordion as AccordionPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

export type AccordionProps =
  | (Omit<AccordionPrimitive.AccordionSingleProps, "type"> & {
      /** `single` closes the open section when another opens. */
      type?: "single"
    })
  | AccordionPrimitive.AccordionMultipleProps

/*
 * Radix owns the behaviour: which sections are open, the arrow keys, Home and
 * End between the headings, and the ids that link each heading to its panel.
 * Only the look is newt/ui's. Without a `type` it is `single` and
 * `collapsible`, so the open section also closes on a second press.
 */
const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({ className, ...props }, ref) => {
  const classes = cn(
    "flex w-full flex-col overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface",
    className
  )
  if (props.type === "multiple") {
    return <AccordionPrimitive.Root ref={ref} className={classes} {...props} />
  }
  return (
    <AccordionPrimitive.Root
      ref={ref}
      collapsible
      className={classes}
      {...props}
      type="single"
    />
  )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      "border-newt-border [&:not(:first-child)]:border-t",
      className
    )}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

/*
 * The always-visible line that opens the section. It is a button inside a
 * heading, so a screen reader lists the sections among the page's headings.
 */
const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="m-0 flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-4 py-3 text-start text-[15px] font-semibold leading-5 text-newt-text-primary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover",
        "focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <svg
        viewBox="0 0 16 16"
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-newt-text-muted group-data-[state=open]:rotate-90 rtl:-scale-x-100 rtl:group-data-[state=open]:scale-x-100"
      >
        <path
          fill="currentColor"
          d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
        />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "px-4 pb-3.5 text-sm leading-5 text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
