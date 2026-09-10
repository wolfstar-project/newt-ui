import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * The lines a channel writes about itself: somebody joined, somebody boosted,
 * a message was pinned. They sit in the timeline where a message would, but
 * they have no author and no avatar — the icon carries the whole meaning, and
 * the colour says which kind of event it was.
 */
const systemMessageVariants = cva("shrink-0", {
  variants: {
    kind: {
      join: "text-newt-online",
      leave: "text-newt-dnd",
      boost: "text-[#ff73fa]",
      pin: "text-newt-text-muted",
      call: "text-newt-online",
    },
  },
  defaultVariants: { kind: "join" },
})

/*
 * Drawn here rather than pulled from an icon set: the registry ships no
 * runtime dependency, and each of these is one shape.
 */
const ICONS = {
  join: "M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1Z",
  leave:
    "M7.05 5.64a1 1 0 0 1 1.41 0L12 9.17l3.54-3.53a1 1 0 1 1 1.41 1.41L13.41 10.6l3.54 3.53a1 1 0 0 1-1.41 1.42L12 12.01l-3.54 3.54a1 1 0 0 1-1.41-1.42l3.53-3.53-3.53-3.54a1 1 0 0 1 0-1.42Z",
  boost:
    "M12 2.5 14.8 8l6.2.9-4.5 4.3 1.1 6.1-5.6-3-5.6 3 1.1-6.1L3 8.9 9.2 8 12 2.5Z",
  pin: "M14.5 2.5a1 1 0 0 1 1.7.7v4.3l3.1 3.1a1 1 0 0 1-.7 1.7h-5.2l-1.7 6.9a1 1 0 0 1-1.9.1L8 12.3H3.8a1 1 0 0 1-.7-1.7l3.1-3.1V3.2a1 1 0 0 1 1.7-.7h6.6Z",
  call: "M6.6 3a1 1 0 0 1 .9.6l1.4 3a1 1 0 0 1-.3 1.2L7.2 8.9a11 11 0 0 0 4.9 4.9l1.1-1.4a1 1 0 0 1 1.2-.3l3 1.4a1 1 0 0 1 .6.9v2.9a1 1 0 0 1-1.1 1A15.4 15.4 0 0 1 3.6 4.1 1 1 0 0 1 4.6 3h2Z",
} as const satisfies Record<
  NonNullable<VariantProps<typeof systemMessageVariants>["kind"]>,
  string
>

export interface SystemMessageProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof systemMessageVariants> {
  /** Replaces the drawn glyph, for an event this list does not cover. */
  icon?: React.ReactNode
}

const SystemMessage = React.forwardRef<HTMLDivElement, SystemMessageProps>(
  ({ className, kind = "join", icon, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-3 px-2 py-1 text-sm leading-[1.375] text-newt-text-muted",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-4 w-4 items-center justify-center",
          systemMessageVariants({ kind })
        )}
      >
        {icon ?? (
          <svg viewBox="0 0 24 24" className="h-full w-full">
            <path fill="currentColor" d={ICONS[kind ?? "join"]} />
          </svg>
        )}
      </span>
      <span className="min-w-0">{children}</span>
    </div>
  )
)
SystemMessage.displayName = "SystemMessage"

/** The name inside a system line, which is bolder than the sentence it sits in. */
const SystemMessageActor = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("font-medium text-newt-text-primary", className)}
    {...props}
  />
))
SystemMessageActor.displayName = "SystemMessageActor"

const SystemMessageTime = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-newt-text-muted", className)}
    {...props}
  />
))
SystemMessageTime.displayName = "SystemMessageTime"

export {
  SystemMessage,
  SystemMessageActor,
  SystemMessageTime,
  systemMessageVariants,
}
