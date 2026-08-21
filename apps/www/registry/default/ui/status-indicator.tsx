import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const PULSE_KEYFRAMES = `@keyframes newt-presence-pulse{0%{transform:scale(.7);opacity:.6}70%{transform:scale(1.6);opacity:0}100%{transform:scale(1.6);opacity:0}}`

const StatusIndicator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="status"
    className={cn("relative inline-block", className)}
    {...props}
  />
))
StatusIndicator.displayName = "StatusIndicator"

const statusDotVariants = cva(
  "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[3px] border-newt-bg-base",
  {
    variants: {
      status: {
        online:
          "bg-newt-online after:pointer-events-none after:absolute after:-inset-1 after:rounded-full after:border-[1.5px] after:border-newt-online after:opacity-0 after:content-[''] after:[animation:newt-presence-pulse_2.4s_ease-out_infinite] motion-reduce:after:[animation:none]",
        idle: "bg-newt-bg-base after:absolute after:inset-0 after:rounded-full after:bg-newt-idle after:content-[''] after:[clip-path:circle(60%_at_35%_35%)]",
        dnd: "bg-newt-bg-base after:absolute after:left-1/2 after:top-1/2 after:h-[22%] after:w-[65%] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-[1px] after:bg-newt-dnd after:content-['']",
        offline: "bg-newt-offline",
        streaming: "bg-[#593695]",
      },
    },
    defaultVariants: {
      status: "offline",
    },
  }
)

export interface StatusDotProps
  extends React.ComponentProps<"div">, VariantProps<typeof statusDotVariants> {}

const StatusDot = React.forwardRef<HTMLDivElement, StatusDotProps>(
  ({ className, status, ...props }, ref) => (
    <>
      {status === "online" ? (
        <style dangerouslySetInnerHTML={{ __html: PULSE_KEYFRAMES }} />
      ) : null}
      <div
        ref={ref}
        data-status={status ?? "offline"}
        className={cn(statusDotVariants({ status }), className)}
        {...props}
      />
    </>
  )
)
StatusDot.displayName = "StatusDot"

export { StatusIndicator, StatusDot, statusDotVariants }
