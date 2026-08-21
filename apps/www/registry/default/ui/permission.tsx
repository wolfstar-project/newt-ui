"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type PermissionValue = "deny" | "inherit" | "allow"

const Permission = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between border-b border-newt-border py-2.5 last:border-b-0",
      className
    )}
    {...props}
  />
))
Permission.displayName = "Permission"

const PermissionInfo = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-0.5", className)}
    {...props}
  />
))
PermissionInfo.displayName = "PermissionInfo"

const PermissionName = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-sm font-medium text-newt-text-primary", className)}
    {...props}
  />
))
PermissionName.displayName = "PermissionName"

const PermissionDescription = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-newt-text-muted", className)}
    {...props}
  />
))
PermissionDescription.displayName = "PermissionDescription"

const stateOptions: { value: PermissionValue; label: string; glyph: string }[] =
  [
    { value: "deny", label: "Deny", glyph: "✕" },
    { value: "inherit", label: "Inherit", glyph: "/" },
    { value: "allow", label: "Allow", glyph: "✓" },
  ]

const activeStateClasses: Record<PermissionValue, string> = {
  deny: "bg-[rgba(242,63,66,0.15)] text-newt-dnd hover:text-newt-dnd",
  inherit: "bg-newt-bg-elevated text-newt-text-secondary",
  allow: "bg-[rgba(35,165,90,0.15)] text-newt-online hover:text-newt-online",
}

export interface PermissionStatesProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  /** Controlled value. */
  value?: PermissionValue
  /** Initial value when uncontrolled. Defaults to `"inherit"`. */
  defaultValue?: PermissionValue
  onValueChange?: (value: PermissionValue) => void
  disabled?: boolean
}

const PermissionStates = React.forwardRef<
  HTMLDivElement,
  PermissionStatesProps
>(
  (
    {
      className,
      value: valueProp,
      defaultValue = "inherit",
      onValueChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] =
      React.useState<PermissionValue>(defaultValue)
    const isControlled = valueProp !== undefined
    const value = isControlled ? valueProp : internal

    const select = (next: PermissionValue) => {
      if (disabled) return
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    }

    return (
      <div
        ref={ref}
        role="group"
        className={cn("flex gap-1 rounded-sm bg-newt-bg-base p-0.5", className)}
        {...props}
      >
        {stateOptions.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              aria-label={option.label}
              disabled={disabled}
              data-state={active ? "active" : "inactive"}
              data-value={option.value}
              onClick={() => select(option.value)}
              className={cn(
                "flex h-7 w-7 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-sm text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-secondary disabled:cursor-not-allowed disabled:opacity-50",
                active && activeStateClasses[option.value]
              )}
            >
              {option.glyph}
            </button>
          )
        })}
      </div>
    )
  }
)
PermissionStates.displayName = "PermissionStates"

export {
  Permission,
  PermissionInfo,
  PermissionName,
  PermissionDescription,
  PermissionStates,
  type PermissionValue,
}
