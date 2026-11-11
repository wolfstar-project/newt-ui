"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/newt/ui/button"
import { Stepper, type StepperStep } from "@/registry/bases/newt/ui/stepper"

/** The wording of the three buttons. */
export interface OnboardingLabels {
  back: string
  next: string
  finish: string
}

export interface OnboardingProps extends Omit<
  React.ComponentProps<"section">,
  "children" | "onChange"
> {
  steps: readonly StepperStep[]
  /** Index of the step being shown. Leave undefined to let the block own it. */
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  /** Called when the last step's button is pressed. */
  onComplete?: () => void
  /** Whether the current step may be left. Defaults to yes. */
  canContinue?: boolean
  labels?: OnboardingLabels
  /** The content of the step whose index it is given. */
  children: (step: number) => React.ReactNode
}

const defaultLabels: OnboardingLabels = {
  back: "Back",
  next: "Next",
  finish: "Finish",
}

/*
 * A short setup flow: where you are in it, the current step's own content,
 * and the two buttons that move through it. The content is a function of the
 * step, so each step stays an ordinary component of yours and the block only
 * owns the order. Moving to another step moves focus to its heading, so a
 * screen reader starts from the new content.
 */
export function Onboarding({
  steps,
  step,
  defaultStep = 0,
  onStepChange,
  onComplete,
  canContinue = true,
  labels = defaultLabels,
  className,
  children,
  ...props
}: OnboardingProps) {
  const [internal, setInternal] = React.useState(defaultStep)
  const current = Math.min(step ?? internal, steps.length - 1)
  const last = current === steps.length - 1
  const heading = React.useRef<HTMLHeadingElement | null>(null)
  const moved = React.useRef(false)

  React.useEffect(() => {
    if (moved.current) heading.current?.focus()
  }, [current])

  const goTo = (next: number) => {
    moved.current = true
    if (step === undefined) setInternal(next)
    onStepChange?.(next)
  }

  return (
    <section
      className={cn(
        "flex w-full flex-col gap-6 rounded-lg border border-newt-border bg-newt-bg-surface p-6",
        className
      )}
      {...props}
    >
      <Stepper steps={steps} value={current} />
      <div className="flex flex-col gap-4">
        <h2
          ref={heading}
          tabIndex={-1}
          className="m-0 text-lg font-semibold leading-6 text-newt-text-primary focus:outline-none"
        >
          {steps[current]?.title}
        </h2>
        {children(current)}
      </div>
      <div className="flex justify-between gap-2">
        <Button
          variant="secondary"
          disabled={current === 0}
          onClick={() => goTo(current - 1)}
        >
          {labels.back}
        </Button>
        <Button
          disabled={!canContinue}
          onClick={() => {
            if (last) onComplete?.()
            else goTo(current + 1)
          }}
        >
          {last ? labels.finish : labels.next}
        </Button>
      </div>
    </section>
  )
}
