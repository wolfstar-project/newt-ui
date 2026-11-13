"use client"

import {
  Checkbox as CheckboxPrimitive,
  Label as LabelPrimitive,
  Switch as SwitchPrimitive,
} from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

export interface FieldProps extends React.ComponentProps<"div"> {
  /**
   * Marks the whole field as failing validation. The controls inside it read
   * `data-invalid` from this wrapper, so one prop restyles the group rather
   * than each control being told separately.
   */
  invalid?: boolean
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, invalid = false, ...props }, ref) => (
    <div
      ref={ref}
      data-invalid={invalid || undefined}
      className={cn("group/field flex flex-col gap-2", className)}
      {...props}
    />
  )
)
Field.displayName = "Field"

/*
 * Radix Label is a native `<label>` that does not select its text on a
 * double press, so a quick second press on it only reaches the control.
 */
const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "text-xs font-bold uppercase tracking-[0.02em] text-newt-text-secondary",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

/*
 * The invalid border is driven by the field wrapper rather than by a prop on
 * each control, so a form library that only knows "this field is in error"
 * needs to say it once.
 */
const controlClassName =
  "w-full rounded-sm border border-newt-border bg-newt-bg-input px-3 py-2.5 font-sans text-sm text-newt-text-primary transition-colors duration-fast ease-newt placeholder:text-newt-text-muted focus:border-newt-brand focus:outline-none group-data-[invalid]/field:border-newt-danger aria-[invalid=true]:border-newt-danger"

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

export interface FieldHelpProps extends React.ComponentProps<"span"> {
  /**
   * `error` colours the text and announces it: a validation message that
   * appears after a submit is useless to a reader who never sees it.
   */
  variant?: "help" | "error"
}

const FieldHelp = React.forwardRef<HTMLSpanElement, FieldHelpProps>(
  ({ className, variant = "help", ...props }, ref) => (
    <span
      ref={ref}
      role={variant === "error" ? "alert" : undefined}
      className={cn(
        "text-xs",
        variant === "error" ? "text-newt-danger" : "text-newt-text-muted",
        className
      )}
      {...props}
    />
  )
)
FieldHelp.displayName = "FieldHelp"

/*
 * Radix owns the behaviour of the two toggles: the role, the checked state,
 * the space bar and the hidden input a form reads when they carry a `name`.
 */
const Switch = React.forwardRef<
  React.ComponentRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      "relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border border-newt-border bg-newt-bg-elevated transition-colors duration-base ease-newt disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-newt-online data-[state=checked]:bg-newt-online",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb className="absolute start-0.5 top-0.5 h-[18px] w-[18px] rounded-full bg-newt-text-muted transition-[transform,background-color] duration-base ease-newt data-[state=checked]:translate-x-[calc(var(--newt-dir)*1rem)] data-[state=checked]:bg-newt-on-accent" />
  </SwitchPrimitive.Root>
))
Switch.displayName = "Switch"

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "group inline-flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-newt-border bg-newt-bg-input text-newt-on-accent transition-colors duration-fast ease-newt focus-visible:border-newt-brand focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-newt-brand data-[state=checked]:bg-newt-brand data-[state=indeterminate]:border-newt-brand data-[state=indeterminate]:bg-newt-brand",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex">
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
        {/* A mixed state draws a dash, so a partial group does not read as full. */}
        <path
          className="group-data-[state=indeterminate]:hidden"
          d="M3 8.5 6.5 12 13 4.5"
        />
        <path
          className="hidden group-data-[state=indeterminate]:block"
          d="M4 8h8"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = "Checkbox"

export { Field, Label, Input, Textarea, Select, FieldHelp, Switch, Checkbox }
