import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/registry/bases/newt/ui/avatar"

/*
 * A record of who changed what, newest first, as an ordered list. Pass
 * `aria-label` to name it.
 */
const AuditLog = React.forwardRef<HTMLOListElement, React.ComponentProps<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("m-0 flex w-full list-none flex-col gap-2 p-0", className)}
      {...props}
    />
  )
)
AuditLog.displayName = "AuditLog"

export type AuditLogKind = "create" | "update" | "delete"

/* One shape per kind, so three colours are never the only difference. */
const KIND = {
  create: {
    className: "text-newt-online",
    label: "Added",
    path: "M8 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 1 1-2 0V9H3a1 1 0 0 1 0-2h4V3a1 1 0 0 1 1-1Z",
  },
  update: {
    className: "text-newt-idle",
    label: "Updated",
    path: "M8 2.75a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5Zm0 2.5a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5Z",
  },
  delete: {
    className: "text-newt-danger",
    label: "Removed",
    path: "M3 7h10a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2Z",
  },
} as const

export interface AuditLogEntryProps extends Omit<
  React.ComponentProps<"li">,
  "children"
> {
  /** Who did it. The first letter is the avatar's fallback. */
  actor: string
  /** What they did, as the middle of a sentence: "updated the role". */
  action: string
  /** What they did it to. */
  target?: string
  kind?: AuditLogKind
  /** The time as the reader should see it. */
  time: string
  /** The same moment in machine form, for the `<time>` element. */
  dateTime?: string
  /** Replaces the default initial avatar, for one with an image. */
  avatar?: React.ReactNode
  /** Read by a screen reader in place of the kind's shape. */
  kindLabel?: string
  /** Start with the changes showing. */
  defaultOpen?: boolean
  /** `AuditLogChange` rows. With none, the entry does not open. */
  children?: React.ReactNode
}

const summaryClassName =
  "flex list-none items-center gap-2.5 px-3 py-2.5 text-sm leading-5 text-newt-text-secondary [&::-webkit-details-marker]:hidden"

/*
 * An entry with changes is a native `<details>`, so it opens with Enter or
 * Space and needs no script; one without is a plain row.
 */
const AuditLogEntry = React.forwardRef<HTMLLIElement, AuditLogEntryProps>(
  (
    {
      className,
      actor,
      action,
      target,
      kind = "update",
      time,
      dateTime,
      avatar,
      kindLabel,
      defaultOpen = false,
      children,
      ...props
    },
    ref
  ) => {
    const mark = KIND[kind]
    const line = (
      <>
        <span className={cn("inline-flex shrink-0", mark.className)}>
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4">
            <path fill="currentColor" fillRule="evenodd" d={mark.path} />
          </svg>
          <span className="sr-only">{kindLabel ?? mark.label}</span>
        </span>
        {avatar ?? <Avatar size="sm">{actor.slice(0, 1).toUpperCase()}</Avatar>}
        <span className="min-w-0 flex-1">
          <strong className="font-semibold text-newt-text-primary">
            {actor}
          </strong>{" "}
          {action}
          {target === undefined ? null : (
            <>
              {" "}
              <strong className="font-semibold text-newt-text-primary">
                {target}
              </strong>
            </>
          )}
        </span>
        <time
          dateTime={dateTime}
          className="shrink-0 text-xs text-newt-text-muted"
        >
          {time}
        </time>
      </>
    )
    const expandable = React.Children.count(children) > 0
    return (
      <li
        ref={ref}
        data-kind={kind}
        className={cn(
          "overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface",
          className
        )}
        {...props}
      >
        {expandable ? (
          <details open={defaultOpen || undefined} className="group">
            <summary
              className={cn(
                summaryClassName,
                "cursor-pointer hover:bg-newt-bg-hover focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link"
              )}
            >
              {line}
              <svg
                viewBox="0 0 16 16"
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-newt-text-muted group-open:rotate-90 rtl:-scale-x-100 rtl:group-open:scale-x-100"
              >
                <path
                  fill="currentColor"
                  d="M5.3 3.3a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4L8.6 8 5.3 4.7a1 1 0 0 1 0-1.4Z"
                />
              </svg>
            </summary>
            <ol className="m-0 flex flex-col gap-1 pb-3 pe-3 ps-12 pt-1 text-[13px] leading-[18px] text-newt-text-secondary [list-style:decimal-leading-zero_inside]">
              {children}
            </ol>
          </details>
        ) : (
          <div className={summaryClassName}>{line}</div>
        )}
      </li>
    )
  }
)
AuditLogEntry.displayName = "AuditLogEntry"

/** One numbered line under an entry. Wrap the value that changed in `<strong>`. */
const AuditLogChange = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, children, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "marker:font-mono marker:text-xs marker:text-newt-text-muted [&_strong]:font-semibold [&_strong]:text-newt-text-primary",
      className
    )}
    {...props}
  >
    {children}
  </li>
))
AuditLogChange.displayName = "AuditLogChange"

export { AuditLog, AuditLogEntry, AuditLogChange }
