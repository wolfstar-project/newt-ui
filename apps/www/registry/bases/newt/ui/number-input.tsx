"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> {
  /** Controlled value. Leave undefined to let the component own it. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  invalid?: boolean
  /** Accessible names of the two stepper buttons. */
  decrementLabel?: string
  incrementLabel?: string
}

/** As many decimals as the step has, so 0.1 + 0.2 reads 0.3. */
function decimalsOf(step: number): number {
  const text = String(step)
  const point = text.indexOf(".")
  return point === -1 ? 0 : text.length - point - 1
}

const stepClassName =
  "inline-flex w-9 shrink-0 items-center justify-center text-newt-text-secondary transition-colors duration-fast ease-newt hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-newt-text-secondary"

/*
 * A number field with its two steppers drawn as real buttons. The input stays
 * `type="number"`, so the arrow keys and the announced range are the
 * browser's. What is typed is kept as text until it parses, so a reader can
 * clear the field or type a minus sign on the way to a number; the value is
 * clamped to `min` and `max` when the field is left.
 */
const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      min,
      max,
      step = 1,
      invalid = false,
      disabled = false,
      decrementLabel = "Decrease",
      incrementLabel = "Increase",
      onBlur,
      ...props
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [text, setText] = React.useState(() =>
      String(value ?? defaultValue ?? "")
    )
    const parsed = text.trim() === "" ? Number.NaN : Number(text)
    /* A controlled value the text does not already spell wins over the text. */
    const shown =
      isControlled && !Number.isNaN(parsed) && parsed !== value
        ? String(value)
        : text
    const current = isControlled ? value : parsed

    const clamp = (point: number) =>
      Math.min(
        max ?? Number.POSITIVE_INFINITY,
        Math.max(min ?? Number.NEGATIVE_INFINITY, point)
      )

    const commit = (point: number) => {
      const next = Number(clamp(point).toFixed(decimalsOf(step)))
      setText(String(next))
      onValueChange?.(next)
    }

    const stepBy = (direction: 1 | -1) => {
      const from = Number.isNaN(current)
        ? (min ?? 0) - direction * step
        : current
      commit(from + direction * step)
    }

    return (
      <div
        data-invalid={invalid || undefined}
        className={cn(
          "inline-flex items-stretch overflow-hidden rounded-sm border border-newt-border bg-newt-bg-input transition-colors duration-fast ease-newt focus-within:border-newt-brand data-[invalid]:border-newt-danger group-data-[invalid]/field:border-newt-danger",
          disabled && "opacity-50",
          className
        )}
      >
        <button
          type="button"
          aria-label={decrementLabel}
          disabled={disabled || (min !== undefined && current <= min)}
          onClick={() => stepBy(-1)}
          className={stepClassName}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              fill="currentColor"
              d="M3 7h10a1 1 0 1 1 0 2H3a1 1 0 0 1 0-2Z"
            />
          </svg>
        </button>
        <input
          ref={ref}
          type="number"
          inputMode={decimalsOf(step) === 0 ? "numeric" : "decimal"}
          min={min}
          max={max}
          step={step}
          value={shown}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(event) => {
            setText(event.target.value)
            const next =
              event.target.value.trim() === ""
                ? Number.NaN
                : Number(event.target.value)
            if (!Number.isNaN(next)) onValueChange?.(next)
          }}
          onBlur={(event) => {
            onBlur?.(event)
            if (!Number.isNaN(parsed) && clamp(parsed) !== parsed) {
              commit(parsed)
            }
          }}
          className="w-16 border-0 bg-transparent px-1 py-2.5 text-center font-sans text-sm tabular-nums text-newt-text-primary [appearance:textfield] focus:outline-none disabled:cursor-not-allowed [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          {...props}
        />
        <button
          type="button"
          aria-label={incrementLabel}
          disabled={disabled || (max !== undefined && current >= max)}
          onClick={() => stepBy(1)}
          className={stepClassName}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
            <path
              fill="currentColor"
              d="M8 2a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2H9v4a1 1 0 1 1-2 0V9H3a1 1 0 0 1 0-2h4V3a1 1 0 0 1 1-1Z"
            />
          </svg>
        </button>
      </div>
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
