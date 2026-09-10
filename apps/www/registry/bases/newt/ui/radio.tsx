"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A radio group: one choice out of a short, visible list. Where a select menu
 * hides its options until asked, this shows them all — which is what the
 * client's settings panels use when there are two or three of them and the
 * difference between them matters.
 *
 * The group owns the value and the keyboard. Each row is a button rather than
 * an `<input>`, so the ring and the dot are stylable, and the roles restate
 * what the native element would have said.
 */
interface RadioGroupContextValue {
  readonly value: string | undefined
  readonly select: (value: string) => void
  readonly register: (value: string, disabled: boolean) => void
  readonly name: string
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
)

function useRadioGroup(component: string): RadioGroupContextValue {
  const context = React.useContext(RadioGroupContext)
  if (context === null) {
    throw new Error(`<${component}> must be used inside a <RadioGroup>.`)
  }
  return context
}

export interface RadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Controlled selection. Leave undefined to let the group own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Accessible name for the group. */
  label?: string
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      label,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const current = isControlled ? value : internal

    /*
     * The order rows register in is the order the arrow keys walk, which is
     * the order they were rendered. A ref keeps that out of render.
     */
    const order = React.useRef<{ value: string; disabled: boolean }[]>([])

    const register = React.useCallback(
      (rowValue: string, disabled: boolean) => {
        const existing = order.current.find((row) => row.value === rowValue)
        if (existing) existing.disabled = disabled
        else order.current.push({ value: rowValue, disabled })
      },
      []
    )

    const select = React.useCallback(
      (next: string) => {
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [isControlled, onValueChange]
    )

    const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const options = order.current.filter((row) => !row.disabled)
      if (options.length === 0) return

      const index = options.findIndex((row) => row.value === current)
      const next = {
        ArrowDown: index + 1,
        ArrowRight: index + 1,
        ArrowUp: index - 1,
        ArrowLeft: index - 1,
        Home: 0,
        End: options.length - 1,
      }[event.key]

      if (next === undefined) return
      event.preventDefault()
      // A group with nothing selected starts from the first row.
      const target = options[(next + options.length) % options.length]
      if (target) select(target.value)
    }

    const context = React.useMemo<RadioGroupContextValue>(
      () => ({ value: current, select, register, name: label ?? "radiogroup" }),
      [current, select, register, label]
    )

    return (
      <RadioGroupContext.Provider value={context}>
        <div
          ref={ref}
          role="radiogroup"
          aria-label={label}
          onKeyDown={move}
          className={cn("flex flex-col gap-1", className)}
          {...props}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    )
  }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  value: string
  /** A second line, when the choice needs a sentence to explain it. */
  description?: React.ReactNode
}

const Radio = React.forwardRef<HTMLButtonElement, RadioProps>(
  (
    {
      className,
      value,
      description,
      children,
      disabled = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const group = useRadioGroup("Radio")
    const checked = group.value === value

    React.useEffect(() => {
      group.register(value, disabled)
    }, [group, value, disabled])

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        // Roving tabindex: the group is one tab stop, and the arrows move
        // within it.
        tabIndex={checked ? 0 : -1}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || disabled) return
          group.select(value)
        }}
        className={cn(
          "group flex cursor-pointer items-center gap-3 border-0 bg-transparent px-1 py-2 text-start font-sans text-[15px] leading-5 text-newt-text-secondary",
          "hover:text-newt-text-primary focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
          checked && "text-newt-text-primary",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          data-checked={checked || undefined}
          className={cn(
            "relative h-5 w-5 shrink-0 rounded-full border-2 border-newt-text-muted transition-colors duration-fast ease-newt",
            "after:absolute after:top-1/2 after:start-1/2 after:h-2 after:w-2 after:rounded-full after:bg-white after:content-['']",
            // Centring, and the dot's grow — both carry the writing direction.
            "after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(0)]",
            "data-[checked]:border-newt-brand data-[checked]:bg-newt-brand",
            "data-[checked]:after:[transform:translate(calc(var(--newt-dir)*-50%),-50%)_scale(1)]",
            !disabled && "group-hover:border-newt-text-secondary"
          )}
        />
        {description === undefined ? (
          children
        ) : (
          <span className="flex min-w-0 flex-col gap-0.5">
            <span>{children}</span>
            <span className="text-[13px] leading-[17px] text-newt-text-muted">
              {description}
            </span>
          </span>
        )}
      </button>
    )
  }
)
Radio.displayName = "Radio"

export { Radio, RadioGroup }
