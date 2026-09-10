"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * Several answers out of a visible list, where a radio group takes one. The
 * group owns the set of chosen values; each row is a real `<input>`, so the
 * space bar, the label association and the indeterminate state all come for
 * free and only the box is redrawn.
 */
interface CheckboxGroupContextValue {
  readonly values: readonly string[]
  readonly toggle: (value: string) => void
  readonly name: string
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
  /** Shared `name` for the inputs. One is generated when it is not given. */
  name?: string
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
      children,
      ...props
    },
    ref
  ) => {
    const generated = React.useId()
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
      () => ({ values: current, toggle, name: name ?? generated }),
      [current, toggle, name, generated]
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
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "defaultChecked" | "value"
> {
  /** What this row stands for in the group's value. */
  value: string
  /** The quieter line under the label. */
  description?: React.ReactNode
}

const CheckboxOption = React.forwardRef<HTMLInputElement, CheckboxOptionProps>(
  ({ className, value, description, disabled, children, ...props }, ref) => {
    const group = useCheckboxGroup("CheckboxOption")
    const checked = group.values.includes(value)

    return (
      <label
        className={cn(
          "group flex items-start gap-3 text-[15px] leading-5 text-newt-text-secondary",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          checked && !disabled && "text-newt-text-primary",
          className
        )}
      >
        {/*
         * The input keeps every behaviour it was born with and loses only its
         * appearance; the box beside it is the drawing.
         */}
        <input
          ref={ref}
          type="checkbox"
          name={group.name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => group.toggle(value)}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          data-checked={checked || undefined}
          className={cn(
            "mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-newt-text-muted transition-colors duration-fast ease-newt",
            "data-[checked]:border-newt-brand data-[checked]:bg-newt-brand",
            "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-newt-text-link",
            !disabled && "group-hover:border-newt-text-secondary"
          )}
        >
          <svg
            viewBox="0 0 16 16"
            className="h-3.5 w-3.5 scale-0 text-white transition-transform duration-fast ease-newt group-has-[:checked]:scale-100"
          >
            <path
              fill="currentColor"
              d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
            />
          </svg>
        </span>
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
  }
)
CheckboxOption.displayName = "CheckboxOption"

export { CheckboxGroup, CheckboxOption }
