"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/** A named point on the track, drawn above it. */
export interface SliderMark {
  value: number
  /** What the mark says. Omitted, it shows the number. */
  label?: string
}

export interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "defaultValue" | "onChange" | "min" | "max" | "step"
> {
  /** Controlled value. Leave undefined to let the slider own it. */
  value?: number
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Labelled points along the track. */
  marks?: readonly SliderMark[]
}

/* The grabber's width; the track is inset by half of it at each end. */
const THUMB = 10

/*
 * A real `<input type="range">` does the work: arrow keys, Home and End, the
 * announced value and touch dragging are all the browser's. It is laid over
 * the drawing and made transparent, so the track, the fill and the grabber
 * are plain boxes placed by one ratio.
 */
const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      marks,
      disabled,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultValue ?? min)
    const isControlled = value !== undefined
    const current = isControlled ? value : internal
    const span = max - min
    const ratioOf = (point: number) =>
      span === 0 ? 0 : Math.min(1, Math.max(0, (point - min) / span))
    const ratio = ratioOf(current)

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-1",
          disabled && "opacity-50",
          className
        )}
      >
        {marks === undefined || marks.length === 0 ? null : (
          <div
            aria-hidden="true"
            className="relative h-[22px]"
            style={{ marginInline: THUMB / 2 }}
          >
            {marks.map((mark) => (
              <span
                key={mark.value}
                className="absolute top-0 flex translate-x-[calc(var(--newt-dir)*-50%)] flex-col items-center gap-0.5 text-[10px] font-bold leading-3 text-newt-text-muted after:h-1.5 after:w-0.5 after:rounded-full after:bg-newt-bg-active after:content-['']"
                style={{ insetInlineStart: `${ratioOf(mark.value) * 100}%` }}
              >
                {mark.label ?? mark.value}
              </span>
            ))}
          </div>
        )}
        <div className="relative flex h-6 items-center">
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={current}
            disabled={disabled}
            onChange={(event) => {
              const next = Number(event.target.value)
              if (!isControlled) setInternal(next)
              onValueChange?.(next)
            }}
            className={cn(
              "peer absolute inset-0 z-[1] m-0 h-full w-full opacity-0",
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            )}
            {...props}
          />
          <div className="h-2 w-full overflow-hidden rounded-full bg-newt-bg-active">
            <div
              className="h-full bg-newt-brand"
              style={{
                width: `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${ratio})`,
              }}
            />
          </div>
          <div
            className="pointer-events-none absolute top-0 h-6 rounded-sm border border-newt-border bg-white shadow-elevation-low peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-newt-text-link"
            style={{
              width: THUMB,
              insetInlineStart: `calc((100% - ${THUMB}px) * ${ratio})`,
            }}
          />
        </div>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
