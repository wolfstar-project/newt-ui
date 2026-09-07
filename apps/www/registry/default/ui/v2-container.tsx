import * as React from "react"

import { cn } from "@/lib/utils"

export interface V2ContainerProps extends React.ComponentProps<"div"> {
  /** Accent colour of the left bar; defaults to the surface border. */
  accentColor?: string
}

/*
 * The Components V2 container: an accent-barred block that groups text,
 * separators and action rows inside a single message.
 */
const V2Container = React.forwardRef<HTMLDivElement, V2ContainerProps>(
  ({ className, accentColor, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mt-1 flex max-w-[520px] flex-col gap-2 rounded-sm border-s-4 border-[var(--newt-v2-accent)] bg-newt-bg-surface p-3 text-sm leading-relaxed text-newt-text-primary",
        className
      )}
      /*
       * SAFETY: `CSSProperties` has no index signature for custom properties,
       * but React forwards unknown `--*` keys to the style attribute verbatim,
       * so the extra key is written out exactly as spelled here.
       */
      style={
        {
          ...style,
          "--newt-v2-accent": accentColor ?? "var(--newt-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
)
V2Container.displayName = "V2Container"

export { V2Container }
