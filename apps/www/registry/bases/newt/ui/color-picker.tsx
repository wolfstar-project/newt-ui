"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** One entry of the palette. */
export interface ColorSwatch {
  /** Any CSS colour; a hex string if the custom tile should round-trip it. */
  value: string
  /** What a screen reader calls it. */
  label: string
}

/*
 * A starting palette, not a token set: these are values a user picks and an
 * application stores, so they are data rather than part of the theme.
 */
export const defaultSwatches: readonly ColorSwatch[] = [
  { value: "#5865f2", label: "Indigo" },
  { value: "#3ba55d", label: "Green" },
  { value: "#1abc9c", label: "Teal" },
  { value: "#3498db", label: "Blue" },
  { value: "#9b59b6", label: "Purple" },
  { value: "#eb459e", label: "Pink" },
  { value: "#f0b232", label: "Amber" },
  { value: "#e67e22", label: "Orange" },
  { value: "#ed4245", label: "Red" },
  { value: "#95a5a6", label: "Grey" },
]

export interface ColorPickerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Controlled colour. Leave undefined to let the component own it. */
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  swatches?: readonly ColorSwatch[]
  /** Show the tile that opens the browser's own colour dialog. */
  allowCustom?: boolean
  /** Accessible name for the group. */
  label?: string
  /** Accessible name for the custom tile. */
  customLabel?: string
  /** Shared `name` for the radios. One is generated when it is not given. */
  name?: string
  disabled?: boolean
}

const HEX = /^#[0-9a-f]{6}$/i

/*
 * A short palette and one way out of it. The swatches are a real radio set,
 * so the arrow keys move between them and a form posts the chosen value; the
 * larger tile is the browser's own colour dialog for anything the palette
 * does not hold, and it wears the colour whenever the value is not a swatch.
 */
const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      swatches = defaultSwatches,
      allowCustom = true,
      label = "Colour",
      customLabel = "Custom colour",
      name,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const generated = React.useId()
    const [internal, setInternal] = React.useState(
      defaultValue ?? swatches[0]?.value ?? ""
    )
    const isControlled = value !== undefined
    const current = (isControlled ? value : internal).toLowerCase()
    const isCustom = !swatches.some(
      (swatch) => swatch.value.toLowerCase() === current
    )

    const commit = (next: string) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={cn(
          "inline-flex items-stretch gap-2.5",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        {allowCustom ? (
          <label
            data-active={isCustom || undefined}
            className="relative flex min-h-[54px] w-[66px] cursor-pointer items-start justify-end rounded-sm border border-newt-border bg-newt-bg-input p-1 text-newt-on-accent focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-newt-text-link data-[active]:border-newt-text-primary data-[active]:ring-1 data-[active]:ring-newt-text-primary"
            style={isCustom ? { backgroundColor: current } : undefined}
          >
            <input
              type="color"
              aria-label={customLabel}
              disabled={disabled}
              value={HEX.test(current) ? current : "#000000"}
              onChange={(event) => commit(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
            <svg
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="h-3.5 w-3.5 drop-shadow-[0_0_1px_rgb(0_0_0/0.7)]"
            >
              <path
                fill="currentColor"
                d="M13.4 2.6a2 2 0 0 0-2.8 0L9 4.2l-.3-.3a1 1 0 0 0-1.4 1.4l.3.3-4.3 4.3a1 1 0 0 0-.3.7V13h2.4a1 1 0 0 0 .7-.3l4.3-4.3.3.3a1 1 0 0 0 1.4-1.4l-.3-.3 1.6-1.6a2 2 0 0 0 0-2.8ZM5 11.6H4.4V11L8.6 6.8l.6.6L5 11.6Z"
              />
            </svg>
          </label>
        ) : null}
        <div className="grid grid-cols-[repeat(5,1.5rem)] content-center gap-1.5">
          {swatches.map((swatch) => (
            <label
              key={swatch.value}
              className="group relative block cursor-pointer"
            >
              <input
                type="radio"
                name={name ?? generated}
                value={swatch.value}
                disabled={disabled}
                checked={swatch.value.toLowerCase() === current}
                onChange={() => commit(swatch.value)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="flex h-6 w-6 items-center justify-center rounded-sm text-newt-on-accent transition-transform duration-fast ease-newt group-hover:scale-110 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-newt-text-link"
                style={{ backgroundColor: swatch.value }}
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4 scale-0 drop-shadow-[0_0_1px_rgb(0_0_0/0.7)] transition-transform duration-fast ease-newt group-has-[:checked]:scale-100"
                >
                  <path
                    fill="currentColor"
                    d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
                  />
                </svg>
              </span>
              <span className="sr-only">{swatch.label}</span>
            </label>
          ))}
        </div>
      </div>
    )
  }
)
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }
