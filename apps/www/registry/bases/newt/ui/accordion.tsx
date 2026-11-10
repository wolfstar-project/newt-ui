"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/* The shared `name` that makes the browser keep one section open. */
const AccordionContext = React.createContext<string | undefined>(undefined)

export interface AccordionProps extends React.ComponentProps<"div"> {
  /**
   * `single` closes the open section when another opens; `multiple` lets
   * them open independently.
   */
  type?: "single" | "multiple"
}

/*
 * Each section is a native `<details>`: the summary is already a button, it
 * already answers Enter and Space, and find-in-page already opens a closed
 * section that holds a match. `single` gives the sections one `name`, which
 * is how the browser itself keeps only one of them open.
 */
const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, type = "single", ...props }, ref) => {
    const name = React.useId()
    return (
      <AccordionContext.Provider value={type === "single" ? name : undefined}>
        <div
          ref={ref}
          className={cn(
            "flex w-full flex-col overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface",
            className
          )}
          {...props}
        />
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

export interface AccordionItemProps extends Omit<
  React.ComponentProps<"details">,
  "title" | "open"
> {
  /** The always-visible line that opens the section. */
  title: React.ReactNode
  /** Start open. The reader, not the application, owns it from there. */
  defaultOpen?: boolean
}

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, title, defaultOpen = false, children, ...props }, ref) => {
    const name = React.useContext(AccordionContext)
    return (
      <details
        ref={ref}
        name={name}
        open={defaultOpen || undefined}
        className={cn(
          "group border-newt-border [&:not(:first-child)]:border-t",
          className
        )}
        {...props}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-semibold leading-5 text-newt-text-primary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link [&::-webkit-details-marker]:hidden">
          {title}
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-newt-text-muted group-open:rotate-90 rtl:-scale-x-100 rtl:group-open:scale-x-100"
          >
            <path
              fill="currentColor"
              d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
            />
          </svg>
        </summary>
        <div className="px-4 pb-3.5 text-sm leading-5 text-newt-text-secondary">
          {children}
        </div>
      </details>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

export { Accordion, AccordionItem }
