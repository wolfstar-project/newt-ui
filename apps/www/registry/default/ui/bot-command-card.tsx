import * as React from "react"

import { cn } from "@/lib/utils"

const BotCommandCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "max-w-[480px] rounded-md border border-newt-border bg-newt-bg-elevated p-4",
      className
    )}
    {...props}
  />
))
BotCommandCard.displayName = "BotCommandCard"

const BotCommandCardHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-2 flex items-center justify-between gap-3", className)}
    {...props}
  />
))
BotCommandCardHeader.displayName = "BotCommandCardHeader"

export interface BotCommandCardNameProps extends React.ComponentProps<"span"> {
  /** Render the muted leading slash. Defaults to true. */
  slash?: boolean
}

const BotCommandCardName = React.forwardRef<
  HTMLSpanElement,
  BotCommandCardNameProps
>(({ className, slash = true, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 font-mono text-sm font-semibold text-newt-brand",
      className
    )}
    {...props}
  >
    {slash ? <span className="font-normal text-newt-text-muted">/</span> : null}
    {children}
  </span>
))
BotCommandCardName.displayName = "BotCommandCardName"

const BotCommandCardDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-3 text-[13px] leading-normal text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
BotCommandCardDescription.displayName = "BotCommandCardDescription"

const BotCommandCardOptions = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-1.5", className)}
    {...props}
  />
))
BotCommandCardOptions.displayName = "BotCommandCardOptions"

export interface BotCommandCardOptionProps extends Omit<
  React.ComponentProps<"div">,
  "children"
> {
  /** Option name, rendered in monospace. */
  name: string
  /** Option type, e.g. `STRING`, `USER`, `INTEGER`. */
  type?: string
  /** Marks the option as required. */
  required?: boolean
  /** Label used for the required marker. */
  requiredLabel?: string
  /** Human readable description. */
  description?: React.ReactNode
}

const BotCommandCardOption = React.forwardRef<
  HTMLDivElement,
  BotCommandCardOptionProps
>(
  (
    {
      className,
      name,
      type,
      required = false,
      requiredLabel = "required",
      description,
      ...props
    },
    ref
  ) => (
    <div
      ref={ref}
      className={cn("flex items-baseline gap-2.5 text-xs", className)}
      {...props}
    >
      <span className="shrink-0 font-mono font-semibold text-newt-text-primary">
        {name}
      </span>
      {type ? (
        <span className="shrink-0 font-mono text-[11px] text-newt-text-muted">
          {type}
        </span>
      ) : null}
      {required ? (
        <span className="shrink-0 text-[11px] font-bold text-newt-dnd">
          {requiredLabel}
        </span>
      ) : null}
      {description ? (
        <span className="text-newt-text-muted">{description}</span>
      ) : null}
    </div>
  )
)
BotCommandCardOption.displayName = "BotCommandCardOption"

export {
  BotCommandCard,
  BotCommandCardHeader,
  BotCommandCardName,
  BotCommandCardDescription,
  BotCommandCardOptions,
  BotCommandCardOption,
}
