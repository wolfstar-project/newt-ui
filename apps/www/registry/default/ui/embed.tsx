import * as React from "react"

import { cn } from "@/lib/utils"

const Embed = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex max-w-[520px] overflow-hidden rounded-md border-l-4 border-newt-brand bg-newt-bg-elevated",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3">
        {children}
      </div>
    </div>
  )
)
Embed.displayName = "Embed"

const EmbedEyebrow = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[12px] font-semibold text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
EmbedEyebrow.displayName = "EmbedEyebrow"

const EmbedTitle = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[16px] font-semibold text-newt-text-link", className)}
    {...props}
  />
))
EmbedTitle.displayName = "EmbedTitle"

const EmbedDescription = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-[14px] leading-[20px] text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
EmbedDescription.displayName = "EmbedDescription"

const EmbedFields = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-1 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2",
      className
    )}
    {...props}
  />
))
EmbedFields.displayName = "EmbedFields"

const EmbedField = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
))
EmbedField.displayName = "EmbedField"

const EmbedFieldName = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-0.5 text-[13px] font-semibold text-newt-text-primary",
      className
    )}
    {...props}
  />
))
EmbedFieldName.displayName = "EmbedFieldName"

const EmbedFieldValue = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-[13px] text-newt-text-secondary", className)}
    {...props}
  />
))
EmbedFieldValue.displayName = "EmbedFieldValue"

const EmbedFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-1 flex items-center gap-2 text-[12px] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
EmbedFooter.displayName = "EmbedFooter"

export {
  Embed,
  EmbedEyebrow,
  EmbedTitle,
  EmbedDescription,
  EmbedFields,
  EmbedField,
  EmbedFieldName,
  EmbedFieldValue,
  EmbedFooter,
}
