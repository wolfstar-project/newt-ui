"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const Field = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
)
Field.displayName = "Field"

const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-xs font-bold uppercase tracking-[0.02em] text-newt-text-secondary",
        className
      )}
      {...props}
    />
  )
)
Label.displayName = "Label"

const controlClassName =
  "w-full rounded-sm border border-newt-border bg-newt-bg-input px-3 py-2.5 font-sans text-sm text-newt-text-primary transition-colors duration-fast ease-newt placeholder:text-newt-text-muted focus:border-newt-brand focus:outline-none"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(controlClassName, className)}
      {...props}
    />
  )
)
Input.displayName = "Input"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(controlClassName, "min-h-[80px] resize-y", className)}
    {...props}
  />
))
Textarea.displayName = "Textarea"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, ...props }, ref) => (
  <select ref={ref} className={cn(controlClassName, className)} {...props} />
))
Select.displayName = "Select"

const FieldHelp = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("text-xs text-newt-text-muted", className)}
    {...props}
  />
))
FieldHelp.displayName = "FieldHelp"

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultChecked)
    const isControlled = checked !== undefined
    const on = isControlled ? checked : internal

    const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || disabled) return
      const next = !on
      if (!isControlled) setInternal(next)
      onCheckedChange?.(next)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={on}
        data-state={on ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border border-newt-border bg-newt-bg-elevated transition-colors duration-base ease-newt disabled:cursor-not-allowed disabled:opacity-50",
          on && "border-newt-online bg-newt-online",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-newt-text-muted transition-[transform,background-color] duration-base ease-newt",
            on && "translate-x-4 bg-white"
          )}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export interface CheckboxProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange"
> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      checked,
      defaultChecked = false,
      onCheckedChange,
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultChecked)
    const isControlled = checked !== undefined
    const on = isControlled ? checked : internal

    const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (event.defaultPrevented || disabled) return
      const next = !on
      if (!isControlled) setInternal(next)
      onCheckedChange?.(next)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={on}
        data-state={on ? "checked" : "unchecked"}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-newt-border bg-newt-bg-input text-white transition-colors duration-fast ease-newt focus-visible:border-newt-brand focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          on && "border-newt-brand bg-newt-brand",
          className
        )}
        {...props}
      >
        {on ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 16 16"
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 8.5 6.5 12 13 4.5" />
          </svg>
        ) : null}
      </button>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Field, Label, Input, Textarea, Select, FieldHelp, Switch, Checkbox }
