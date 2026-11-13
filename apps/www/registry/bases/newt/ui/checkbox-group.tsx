"use client"

import { Checkbox as CheckboxPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Several answers out of a visible list, where a radio group takes one. The
 * group owns the set of chosen values; each row is a Radix Checkbox, which
 * owns the role, the space bar and the hidden input a form reads.
 */
interface CheckboxGroupContextValue {
  readonly values: readonly string[]
  readonly toggle: (value: string) => void
  readonly name: string | undefined
  readonly disabled: boolean
}

const CheckboxGroupContext =
  React.createContext<CheckboxGroupContextValue | null>(null)

function useCheckboxGroup(component: string): CheckboxGroupContextValue {
  const context = React.useContext(CheckboxGroupContext)
  if (context === null) {
    throw new Error(`<${component}> must be used inside a <CheckboxGroup>.`)
  }
  return context
}

export interface CheckboxGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Controlled selection. Leave undefined to let the group own it. */
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: readonly string[]) => void
  /** Accessible name for the group. */
  label?: string
  /** Shared `name` of the rows. A form then receives one entry per checked row. */
  name?: string
  /** Disables every row. */
  disabled?: boolean
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className,
      value,
      defaultValue = [],
      onValueChange,
      label,
      name,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] =
      React.useState<readonly string[]>(defaultValue)
    const isControlled = value !== undefined
    const current = isControlled ? value : internal

    const toggle = React.useCallback(
      (option: string) => {
        const next = current.includes(option)
          ? current.filter((each) => each !== option)
          : [...current, option]
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [current, isControlled, onValueChange]
    )

    const context = React.useMemo<CheckboxGroupContextValue>(
      () => ({ values: current, toggle, name, disabled }),
      [current, toggle, name, disabled]
    )

    return (
      <CheckboxGroupContext.Provider value={context}>
        <div
          ref={ref}
          role="group"
          aria-label={label}
          className={cn("flex flex-col gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    )
  }
)
CheckboxGroup.displayName = "CheckboxGroup"

export interface CheckboxOptionProps extends Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "checked" | "defaultChecked" | "onCheckedChange" | "value" | "name"
> {
  /** What this row stands for in the group's value. */
  value: string
  /** The quieter line under the label. */
  description?: React.ReactNode
}

const CheckboxOption = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxOptionProps
>(({ className, value, description, disabled, children, ...props }, ref) => {
  const group = useCheckboxGroup("CheckboxOption")
  const checked = group.values.includes(value)
  const isDisabled = group.disabled || disabled === true

  return (
    /*
     * The label wraps the box, so a press on the text reaches it and the text
     * is its accessible name.
     */
    <label
      className={cn(
        "group flex items-start gap-3 text-[15px] leading-5 text-newt-text-secondary",
        isDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        checked && !isDisabled && "text-newt-text-primary",
        className
      )}
    >
      <CheckboxPrimitive.Root
        ref={ref}
        name={group.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onCheckedChange={() => group.toggle(value)}
        className={cn(
          "mt-px flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-newt-text-muted bg-transparent p-0 transition-colors duration-fast ease-newt disabled:cursor-not-allowed",
          "data-[state=checked]:border-newt-brand data-[state=checked]:bg-newt-brand",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
          !isDisabled && "group-hover:border-newt-text-secondary"
        )}
        {...props}
      >
        {/* Mounted in both states, so the check can scale in and out. */}
        <CheckboxPrimitive.Indicator
          forceMount
          className="flex scale-0 text-newt-on-accent transition-transform duration-fast ease-newt data-[state=checked]:scale-100"
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5">
            <path
              fill="currentColor"
              d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
            />
          </svg>
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span>{children}</span>
        {description === undefined ? null : (
          <span className="text-[13px] leading-[17px] text-newt-text-muted">
            {description}
          </span>
        )}
      </span>
    </label>
  )
})
CheckboxOption.displayName = "CheckboxOption"

export { CheckboxGroup, CheckboxOption }
