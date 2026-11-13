"use client"

import { Slider as SliderPrimitive } from "radix-ui"
import * as React from "react"

import { cn } from "@/lib/utils"

/** A named point on the track, drawn above it. */
export interface SliderMark {
  value: number
  /** What the mark says. Omitted, it shows the number. */
  label?: string
}

export interface SliderProps extends React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> {
  /** Labelled points along the track. */
  marks?: readonly SliderMark[]
}

/*
 * Radix owns the behaviour: pointer and touch dragging, arrow keys, Page Up
 * and Page Down, Home and End, and the hidden input a form reads. Only the
 * look is newt/ui's. The value is an array, one entry per grabber.
 */
const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      marks,
      min = 0,
      max = 100,
      value,
      defaultValue,
      disabled,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-valuetext": ariaValueText,
      ...props
    },
    ref
  ) => {
    const span = max - min
    const ratioOf = (point: number) =>
      span === 0 ? 0 : Math.min(1, Math.max(0, (point - min) / span))
    const thumbs = (value ?? defaultValue ?? [min]).length
    /*
     * `role="slider"` is on the grabber, so that is where the name goes. Two
     * grabbers keep Radix's "Minimum" and "Maximum", and the name moves to a
     * group around them.
     */
    const single = thumbs === 1

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-1",
          disabled && "opacity-50",
          className
        )}
      >
        {marks === undefined || marks.length === 0 ? null : (
          // Inset by half a grabber, which is where the grabber's centre stops.
          <div aria-hidden="true" className="relative mx-[5px] h-[22px]">
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
        <SliderPrimitive.Root
          ref={ref}
          min={min}
          max={max}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          role={single ? undefined : "group"}
          aria-label={single ? undefined : ariaLabel}
          aria-labelledby={single ? undefined : ariaLabelledby}
          className="relative flex h-6 w-full cursor-pointer touch-none select-none items-center data-[disabled]:cursor-not-allowed"
          {...props}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-newt-bg-active">
            <SliderPrimitive.Range className="absolute h-full bg-newt-brand" />
          </SliderPrimitive.Track>
          {Array.from({ length: thumbs }, (_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              /* An explicit undefined would replace the "Minimum" and "Maximum" names. */
              {...(single
                ? {
                    "aria-label": ariaLabel,
                    "aria-labelledby": ariaLabelledby,
                    "aria-valuetext": ariaValueText,
                  }
                : {})}
              className="block h-6 w-2.5 rounded-sm border border-newt-border bg-newt-on-accent shadow-elevation-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link"
            />
          ))}
        </SliderPrimitive.Root>
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
