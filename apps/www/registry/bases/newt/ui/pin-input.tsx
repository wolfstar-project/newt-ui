"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface PinInputProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** How many characters the code has. */
  length?: number
  /** Controlled code. Leave undefined to let the component own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Called once, with the code, when the last box is filled. */
  onComplete?: (value: string) => void
  /** `numeric` accepts digits only; `alphanumeric` also takes letters. */
  type?: "numeric" | "alphanumeric"
  /** Draw every character as a dot, for a code that is a secret. */
  mask?: boolean
  /** A separator after every this-many boxes. `0` draws none. */
  groupSize?: number
  disabled?: boolean
  invalid?: boolean
  /** Accessible name for the group of boxes. */
  label?: string
  /** Posts the code with a form, through a hidden input. */
  name?: string
}

/* Global, so `match` returns every accepted character and drops the rest. */
const ACCEPT = {
  numeric: /\d/g,
  alphanumeric: /[a-z0-9]/gi,
} as const

/** Where a navigation key sends focus, or `undefined` for any other key. */
function moveFor(
  key: string,
  index: number,
  forward: number,
  length: number
): number | undefined {
  switch (key) {
    case "ArrowLeft":
      return index - forward
    case "ArrowRight":
      return index + forward
    case "Home":
      return 0
    case "End":
      return length - 1
    default:
      return undefined
  }
}

/*
 * A short code, one character to a box. Each box is its own `<input>`, so a
 * screen reader can say which one it is on; the first carries
 * `one-time-code`, so a code from a text message fills all of them. The value
 * is one string with no gaps: a character typed past the end lands in the
 * first empty box.
 */
const PinInput = React.forwardRef<HTMLDivElement, PinInputProps>(
  (
    {
      className,
      length = 6,
      value,
      defaultValue = "",
      onValueChange,
      onComplete,
      type = "numeric",
      mask = false,
      groupSize = 0,
      disabled = false,
      invalid = false,
      label = "Verification code",
      name,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultValue)
    const isControlled = value !== undefined
    const code = (isControlled ? value : internal).slice(0, length)
    const cells = React.useRef<(HTMLInputElement | null)[]>([])

    const focus = (index: number) => {
      const cell = cells.current[Math.max(0, Math.min(length - 1, index))]
      cell?.focus()
      cell?.select()
    }

    const commit = (next: string) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
      if (next.length === length && next !== code) onComplete?.(next)
    }

    const handleChange = (index: number, raw: string) => {
      const existing = code[index] ?? ""
      /* With the box's own character still in it, only the rest is new. */
      const typed =
        existing !== "" && raw.length > 1 && raw.startsWith(existing)
          ? raw.slice(existing.length)
          : raw
      const chars = typed.match(ACCEPT[type]) ?? []
      if (chars.length === 0) {
        if (raw === "") commit(code.slice(0, index) + code.slice(index + 1))
        return
      }
      const at = Math.min(index, code.length)
      const next = (
        code.slice(0, at) +
        chars.join("") +
        code.slice(at + chars.length)
      ).slice(0, length)
      commit(next)
      focus(at + chars.length)
    }

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      const forward =
        getComputedStyle(event.currentTarget).direction === "rtl" ? -1 : 1
      const move = moveFor(event.key, index, forward, length)
      if (move !== undefined) {
        event.preventDefault()
        focus(move)
        return
      }
      if (
        event.key === "Backspace" &&
        (code[index] ?? "") === "" &&
        index > 0
      ) {
        event.preventDefault()
        commit(code.slice(0, index - 1) + code.slice(index))
        focus(index - 1)
      }
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        data-invalid={invalid || undefined}
        className={cn("group/pin inline-flex items-center gap-2", className)}
        {...props}
      >
        {Array.from({ length }, (_, index) => (
          <React.Fragment key={index}>
            {groupSize > 0 && index > 0 && index % groupSize === 0 ? (
              <span
                aria-hidden="true"
                className="h-0.5 w-2 rounded-full bg-newt-text-muted"
              />
            ) : null}
            <input
              ref={(node) => {
                cells.current[index] = node
              }}
              type={mask ? "password" : "text"}
              inputMode={type === "numeric" ? "numeric" : "text"}
              autoComplete={index === 0 ? "one-time-code" : "off"}
              aria-label={`${type === "numeric" ? "Digit" : "Character"} ${index + 1} of ${length}`}
              aria-invalid={invalid || undefined}
              disabled={disabled}
              value={code[index] ?? ""}
              onChange={(event) => handleChange(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onFocus={(event) => event.target.select()}
              className="h-[52px] w-11 rounded-sm border border-newt-border bg-newt-bg-input p-0 text-center font-mono text-xl font-semibold text-newt-text-primary caret-newt-brand transition-colors duration-fast ease-newt focus:border-newt-brand focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 group-data-[invalid]/pin:border-newt-danger"
            />
          </React.Fragment>
        ))}
        {name === undefined ? null : (
          <input type="hidden" name={name} value={code} />
        )}
      </div>
    )
  }
)
PinInput.displayName = "PinInput"

export { PinInput }
