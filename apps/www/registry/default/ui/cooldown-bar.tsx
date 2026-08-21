import * as React from "react"

import { cn } from "@/lib/utils"

const CooldownBar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex max-w-[260px] flex-col gap-1.5", className)}
    {...props}
  />
))
CooldownBar.displayName = "CooldownBar"

const CooldownBarLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex justify-between text-xs text-newt-text-muted",
      className
    )}
    {...props}
  />
))
CooldownBarLabel.displayName = "CooldownBarLabel"

const CooldownBarValue = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <strong
    ref={ref}
    className={cn(
      "font-mono font-semibold text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
CooldownBarValue.displayName = "CooldownBarValue"

export interface CooldownBarTrackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Fill percentage, 0-100. */
  value: number
  /** Switch the fill to the "ready" (online green) colour. */
  ready?: boolean
}

const CooldownBarTrack = React.forwardRef<
  HTMLDivElement,
  CooldownBarTrackProps
>(({ className, value, ready = false, ...props }, ref) => {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      data-state={ready ? "ready" : "cooling"}
      className={cn(
        "h-1.5 overflow-hidden rounded-full bg-newt-bg-base",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full",
          ready ? "bg-newt-online" : "bg-newt-idle"
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
})
CooldownBarTrack.displayName = "CooldownBarTrack"

export { CooldownBar, CooldownBarLabel, CooldownBarValue, CooldownBarTrack }
