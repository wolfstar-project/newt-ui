"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A poll in a message: a question, the answers, and what everyone picked.
 *
 * The bar behind each answer is the result, so it only exists once the results
 * are showing — before that the row is a button and nothing more. Percentages
 * are computed here from the counts rather than passed in, because two numbers
 * that must agree are one number too many.
 */
interface PollContextValue {
  readonly total: number
  readonly showResults: boolean
  readonly selected: readonly string[]
  readonly choose: (value: string) => void
  readonly multiple: boolean
}

const PollContext = React.createContext<PollContextValue | null>(null)

function usePoll(component: string): PollContextValue {
  const context = React.useContext(PollContext)
  if (context === null) {
    throw new Error(`<${component}> must be used inside a <Poll>.`)
  }
  return context
}

export interface PollProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** Every vote cast, which is what the percentages are taken out of. */
  total?: number
  /** Shows the bars and the counts. A closed poll always shows them. */
  showResults?: boolean
  /** Whether more than one answer can be picked. */
  multiple?: boolean
  /** Controlled selection. */
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: readonly string[]) => void
}

const Poll = React.forwardRef<HTMLDivElement, PollProps>(
  (
    {
      className,
      total = 0,
      showResults = false,
      multiple = false,
      value,
      defaultValue = [],
      onValueChange,
      children,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] =
      React.useState<readonly string[]>(defaultValue)
    const isControlled = value !== undefined
    const selected = isControlled ? value : internal

    const choose = React.useCallback(
      (answer: string) => {
        const next = multiple
          ? selected.includes(answer)
            ? selected.filter((each) => each !== answer)
            : [...selected, answer]
          : [answer]
        if (!isControlled) setInternal(next)
        onValueChange?.(next)
      },
      [multiple, selected, isControlled, onValueChange]
    )

    const context = React.useMemo<PollContextValue>(
      () => ({ total, showResults, selected, choose, multiple }),
      [total, showResults, selected, choose, multiple]
    )

    return (
      <PollContext.Provider value={context}>
        <div
          ref={ref}
          className={cn(
            "flex w-full max-w-[440px] flex-col gap-3 rounded-lg border border-newt-border bg-newt-bg-surface p-4",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </PollContext.Provider>
    )
  }
)
Poll.displayName = "Poll"

const PollQuestion = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "font-display text-base font-bold leading-snug text-newt-text-primary",
      className
    )}
    {...props}
  />
))
PollQuestion.displayName = "PollQuestion"

const PollAnswers = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props} />
))
PollAnswers.displayName = "PollAnswers"

export interface PollAnswerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  /** What this answer is called in the poll's value. */
  value: string
  /** How many people picked it. */
  votes?: number
  /** The emoji beside the answer, if it has one. */
  emoji?: React.ReactNode
}

const PollAnswer = React.forwardRef<HTMLButtonElement, PollAnswerProps>(
  (
    {
      className,
      value,
      votes = 0,
      emoji,
      disabled,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const poll = usePoll("PollAnswer")
    const chosen = poll.selected.includes(value)
    const share = poll.total === 0 ? 0 : Math.round((votes / poll.total) * 100)

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={chosen}
        disabled={disabled}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented || disabled) return
          poll.choose(value)
        }}
        data-chosen={chosen || undefined}
        className={cn(
          "relative flex items-center gap-3 overflow-hidden rounded-md border border-newt-border bg-newt-bg-base px-3 py-2.5 text-start text-sm text-newt-text-secondary",
          "transition-colors duration-fast ease-newt hover:border-newt-text-muted",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
          "data-[chosen]:border-newt-brand data-[chosen]:text-newt-text-primary",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
        {...props}
      >
        {/*
         * The bar sits behind the label rather than beside it: the row keeps
         * its height whatever the result is, so the list does not shuffle when
         * the votes land.
         */}
        {poll.showResults ? (
          <span
            aria-hidden="true"
            style={{ inlineSize: `${share}%` }}
            className="absolute inset-y-0 start-0 bg-newt-brand/25"
          />
        ) : null}

        {emoji === undefined ? null : (
          <span aria-hidden="true" className="relative shrink-0 text-base">
            {emoji}
          </span>
        )}
        <span className="relative min-w-0 flex-1 truncate">{children}</span>
        {poll.showResults ? (
          <span className="relative shrink-0 text-xs tabular-nums text-newt-text-muted">
            {share}%
          </span>
        ) : null}
      </button>
    )
  }
)
PollAnswer.displayName = "PollAnswer"

const PollFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-2 text-xs text-newt-text-muted",
      className
    )}
    {...props}
  />
))
PollFooter.displayName = "PollFooter"

export { Poll, PollAnswer, PollAnswers, PollFooter, PollQuestion }
