import * as React from "react"

import { cn } from "@/lib/utils"

export interface EmbedProps extends Omit<React.ComponentProps<"div">, "color"> {
  /** Accent colour of the left bar. Any CSS colour; defaults to the brand. */
  color?: string
}

const Embed = React.forwardRef<HTMLDivElement, EmbedProps>(
  ({ className, children, color, style, ...props }, ref) => (
    <div
      ref={ref}
      /*
       * SAFETY: `CSSProperties` has no index signature for custom properties,
       * but React forwards unknown `--*` keys to the style attribute verbatim,
       * so the extra key is written out exactly as spelled here.
       */
      style={
        color
          ? ({ ...style, "--newt-embed-color": color } as React.CSSProperties)
          : style
      }
      className={cn(
        "flex max-w-[var(--newt-embed-max-width)] overflow-hidden rounded-md border-l-4 border-[var(--newt-embed-color,var(--newt-brand))] bg-newt-bg-elevated",
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

const EmbedAuthor = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-w-0 items-center gap-2 text-[14px] font-semibold text-newt-text-primary",
      className
    )}
    {...props}
  />
))
EmbedAuthor.displayName = "EmbedAuthor"

const EmbedAuthorIcon = React.forwardRef<
  HTMLImageElement,
  React.ComponentProps<"img">
>(({ className, alt = "", ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    aria-hidden={alt === "" ? true : undefined}
    className={cn("h-6 w-6 shrink-0 rounded-full object-cover", className)}
    {...props}
  />
))
EmbedAuthorIcon.displayName = "EmbedAuthorIcon"

const EmbedAuthorName = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn("truncate", className)} {...props} />
))
EmbedAuthorName.displayName = "EmbedAuthorName"

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
      "mt-1 flex min-w-0 items-center gap-2 text-[12px] text-newt-text-muted",
      className
    )}
    {...props}
  />
))
EmbedFooter.displayName = "EmbedFooter"

const EmbedFooterIcon = React.forwardRef<
  HTMLImageElement,
  React.ComponentProps<"img">
>(({ className, alt = "", ...props }, ref) => (
  <img
    ref={ref}
    alt={alt}
    aria-hidden={alt === "" ? true : undefined}
    className={cn("h-4 w-4 shrink-0 rounded-full object-cover", className)}
    {...props}
  />
))
EmbedFooterIcon.displayName = "EmbedFooterIcon"

/* Middle dot, the way Discord separates footer text from the timestamp. */
const EmbedFooterSeparator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, children = "\u2022", ...props }, ref) => (
  <span
    ref={ref}
    aria-hidden="true"
    className={cn("mx-1", className)}
    {...props}
  >
    {children}
  </span>
))
EmbedFooterSeparator.displayName = "EmbedFooterSeparator"

/*
 * A fixed locale, not the visitor's: an embed rendered on the server and
 * hydrated in the browser has to produce the same string in both places.
 */
const embedTimeFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "short",
})

export interface EmbedTimestampProps extends Omit<
  React.ComponentProps<"time">,
  "dateTime"
> {
  /** The moment to render. Anything `new Date()` accepts. */
  date: Date | number | string
}

const EmbedTimestamp = React.forwardRef<HTMLTimeElement, EmbedTimestampProps>(
  ({ className, date, children, ...props }, ref) => {
    const value = date instanceof Date ? date : new Date(date)
    const valid = !Number.isNaN(value.getTime())
    return (
      <time
        ref={ref}
        dateTime={valid ? value.toISOString() : undefined}
        className={cn(className)}
        {...props}
      >
        {children ?? (valid ? embedTimeFormat.format(value) : "")}
      </time>
    )
  }
)
EmbedTimestamp.displayName = "EmbedTimestamp"

export {
  Embed,
  EmbedAuthor,
  EmbedAuthorIcon,
  EmbedAuthorName,
  EmbedEyebrow,
  EmbedTitle,
  EmbedDescription,
  EmbedFields,
  EmbedField,
  EmbedFieldName,
  EmbedFieldValue,
  EmbedFooter,
  EmbedFooterIcon,
  EmbedFooterSeparator,
  EmbedTimestamp,
}
