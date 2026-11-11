"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface TagInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type"
> {
  /** Controlled list. Leave undefined to let the component own it. */
  value?: readonly string[]
  defaultValue?: readonly string[]
  onValueChange?: (value: readonly string[]) => void
  /** Stop accepting tags once the list is this long. */
  max?: number
  invalid?: boolean
  /** The accessible name of a tag's remove button. */
  removeLabel?: (tag: string) => string
}

const defaultRemoveLabel = (tag: string) => `Remove ${tag}`

/*
 * A text field that keeps what was typed as chips. Enter or a comma commits
 * the text, Backspace in an empty field takes the last chip back, and a
 * pasted list is split on commas and new lines. A duplicate is dropped
 * rather than added twice.
 */
const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      className,
      value,
      defaultValue = [],
      onValueChange,
      max,
      invalid = false,
      disabled = false,
      removeLabel = defaultRemoveLabel,
      onKeyDown,
      onPaste,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] =
      React.useState<readonly string[]>(defaultValue)
    const [text, setText] = React.useState("")
    const isControlled = value !== undefined
    const tags = isControlled ? value : internal

    const commit = (next: readonly string[]) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next)
    }

    const add = (candidates: readonly string[]) => {
      const next = [...tags]
      for (const candidate of candidates) {
        const tag = candidate.trim()
        if (tag === "" || next.includes(tag)) continue
        if (max !== undefined && next.length >= max) break
        next.push(tag)
      }
      if (next.length !== tags.length) commit(next)
    }

    return (
      // The wrapper is drawn as the field; a click anywhere in it is a click
      // on the input, which is the only thing in it a keyboard reaches first.
      // oxlint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions -- pointer convenience only; the input and the remove buttons are the keyboard targets
      <div
        data-tag-input=""
        data-invalid={invalid || undefined}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.querySelector("input")?.focus()
          }
        }}
        className={cn(
          "flex min-h-[42px] w-full cursor-text flex-wrap items-center gap-1.5 rounded-sm border border-newt-border bg-newt-bg-input px-2 py-1.5 transition-colors duration-fast ease-newt focus-within:border-newt-brand data-[invalid]:border-newt-danger group-data-[invalid]/field:border-newt-danger",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex max-w-full items-center gap-1 rounded-sm bg-newt-bg-active py-[3px] pe-1 ps-2 text-[13px] font-medium leading-[18px] text-newt-text-primary"
          >
            <span className="truncate">{tag}</span>
            <button
              type="button"
              disabled={disabled}
              aria-label={removeLabel(tag)}
              onClick={(event) => {
                commit(tags.filter((each) => each !== tag))
                event.currentTarget
                  .closest("[data-tag-input]")
                  ?.querySelector("input")
                  ?.focus()
              }}
              className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-newt-text-muted hover:bg-newt-danger hover:text-newt-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-newt-text-link"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3 w-3">
                <path
                  fill="currentColor"
                  d="M4.3 4.3a1 1 0 0 1 1.4 0L8 6.6l2.3-2.3a1 1 0 1 1 1.4 1.4L9.4 8l2.3 2.3a1 1 0 0 1-1.4 1.4L8 9.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L6.6 8 4.3 5.7a1 1 0 0 1 0-1.4Z"
                />
              </svg>
            </button>
          </span>
        ))}
        <input
          ref={ref}
          type="text"
          value={text}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            onKeyDown?.(event)
            /*
             * While an input method is composing, Enter confirms a candidate
             * and is not the reader committing a tag.
             */
            if (event.defaultPrevented || event.nativeEvent.isComposing) return
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault()
              add([text])
              setText("")
            } else if (
              event.key === "Backspace" &&
              text === "" &&
              tags.length > 0
            ) {
              commit(tags.slice(0, -1))
            }
          }}
          onPaste={(event) => {
            onPaste?.(event)
            if (event.defaultPrevented) return
            const pasted = event.clipboardData.getData("text")
            if (!/[,\n]/.test(pasted)) return
            event.preventDefault()
            add(pasted.split(/[,\n]/))
          }}
          className="min-w-20 flex-1 border-0 bg-transparent px-1 py-[3px] font-sans text-sm leading-[18px] text-newt-text-primary placeholder:text-newt-text-muted focus:outline-none disabled:cursor-not-allowed"
          {...props}
        />
      </div>
    )
  }
)
TagInput.displayName = "TagInput"

export { TagInput }
