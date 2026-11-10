import * as React from "react"

import { cn } from "@/lib/utils"

/** One stage of the sequence. */
export interface StepperStep {
  title: string
  /** The quieter line under the title. */
  description?: string
}

export interface StepperProps extends Omit<
  React.ComponentProps<"ol">,
  "children"
> {
  steps: readonly StepperStep[]
  /**
   * Index of the step in progress. Every step before it is complete; a value
   * equal to `steps.length` means all of them are.
   */
  value: number
  orientation?: "horizontal" | "vertical"
  /** Read after a finished step's title by a screen reader. */
  completedLabel?: string
}

/*
 * Progress through a fixed sequence, as an ordered list. A step's state is
 * said three ways, so it never rests on colour: the marker's fill, a check
 * in place of the number, and `aria-current="step"` on the one in progress.
 */
const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  (
    {
      className,
      steps,
      value,
      orientation = "horizontal",
      completedLabel = "completed",
      ...props
    },
    ref
  ) => {
    const vertical = orientation === "vertical"
    return (
      <ol
        ref={ref}
        data-orientation={orientation}
        className={cn(
          "m-0 flex w-full list-none p-0",
          vertical ? "flex-col" : "gap-2",
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const complete = index < value
          const current = index === value
          const last = index === steps.length - 1
          return (
            <li
              // Positional: the list is fixed, and two steps may share a title.
              key={index}
              aria-current={current ? "step" : undefined}
              className={cn(
                "relative flex min-w-0",
                vertical
                  ? "items-start gap-3 text-start"
                  : "flex-1 flex-col items-center gap-2 text-center",
                vertical && !last && "pb-5"
              )}
            >
              {last ? null : (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute rounded-full",
                    complete ? "bg-newt-brand" : "bg-newt-bg-active",
                    vertical
                      ? "start-[13px] top-8 h-[calc(100%-36px)] w-0.5"
                      : "start-[calc(50%+20px)] top-[13px] h-0.5 w-[calc(100%-32px)]"
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-bold",
                  complete
                    ? "border-newt-brand bg-newt-brand text-white"
                    : current
                      ? "border-newt-brand bg-newt-bg-surface text-newt-text-primary"
                      : "border-newt-bg-active bg-newt-bg-surface text-newt-text-muted"
                )}
              >
                {complete ? (
                  <svg viewBox="0 0 16 16" className="h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M6.2 11.6 3.1 8.5a1 1 0 0 1 1.4-1.4l1.7 1.7 4.3-4.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0Z"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={cn(
                  "flex min-w-0 flex-col gap-0.5",
                  vertical && "pt-1"
                )}
              >
                <span
                  className={cn(
                    "text-sm font-semibold leading-[18px]",
                    complete || current
                      ? "text-newt-text-primary"
                      : "text-newt-text-secondary"
                  )}
                >
                  {step.title}
                  {complete ? (
                    <span className="sr-only">, {completedLabel}</span>
                  ) : null}
                </span>
                {step.description === undefined ? null : (
                  <span className="text-xs leading-4 text-newt-text-muted">
                    {step.description}
                  </span>
                )}
              </span>
            </li>
          )
        })}
      </ol>
    )
  }
)
Stepper.displayName = "Stepper"

export { Stepper }
