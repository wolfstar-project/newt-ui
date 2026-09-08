"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const AddIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z"
    />
  </svg>
)

const SendIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path fill="currentColor" d="M3 20.5v-6l8-2.5-8-2.5v-6l19 8.5z" />
  </svg>
)

const composerButton =
  "inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent p-0 text-inherit hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50"

export interface MessageComposerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onSubmit" | "onChange" | "children"
> {
  /** Channel the message goes to; drives the default placeholder and labels. */
  channelName: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  /** Sent on Enter and on the send control. */
  onSubmit?: (value: string) => void
  onEscape?: () => void
  /** Arrow keys, for driving a suggestion list above the composer. */
  onNavigate?: (direction: "up" | "down") => void
  /** Wire the input up as a combobox for slash-command autocomplete. */
  autocomplete?: boolean
  ariaControls?: string
  ariaExpanded?: boolean
  ariaActiveDescendant?: string
  /** Extra controls rendered between the field and the send button. */
  actions?: React.ReactNode
  onAdd?: () => void
}

const MessageComposer = React.forwardRef<HTMLDivElement, MessageComposerProps>(
  (
    {
      className,
      channelName,
      value,
      defaultValue = "",
      onValueChange,
      placeholder,
      onSubmit,
      onEscape,
      onNavigate,
      autocomplete = false,
      ariaControls,
      ariaExpanded,
      ariaActiveDescendant,
      actions,
      onAdd,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const text = value ?? uncontrolled
    const hasValue = text.trim().length > 0
    const label = placeholder ?? `Message #${channelName}`

    const change = (next: string) => {
      if (value === undefined) setUncontrolled(next)
      onValueChange?.(next)
    }

    const submit = () => {
      if (!hasValue) return
      onSubmit?.(text)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      switch (event.key) {
        case "Enter":
          event.preventDefault()
          submit()
          return
        case "Escape":
          event.preventDefault()
          onEscape?.()
          return
        case "ArrowUp":
        case "ArrowDown":
          if (!onNavigate) return
          event.preventDefault()
          onNavigate(event.key === "ArrowUp" ? "up" : "down")
      }
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={`Message composer for #${channelName}`}
        className={cn(
          "flex min-h-11 min-w-0 items-center gap-2 rounded-md border border-newt-border bg-newt-bg-input-elevated px-4 text-newt-text-muted",
          className
        )}
        {...props}
      >
        <button
          type="button"
          aria-label="Add attachment"
          className={composerButton}
          onClick={onAdd}
        >
          <AddIcon />
        </button>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <input
            type="text"
            value={text}
            placeholder={label}
            aria-label={label}
            spellCheck={false}
            role={autocomplete ? "combobox" : undefined}
            autoComplete={autocomplete ? "off" : undefined}
            aria-controls={autocomplete ? ariaControls : undefined}
            aria-expanded={autocomplete ? ariaExpanded : undefined}
            aria-activedescendant={
              autocomplete ? ariaActiveDescendant : undefined
            }
            onChange={(event) => change(event.target.value)}
            onKeyDown={onKeyDown}
            className="w-full border-0 bg-transparent font-sans text-[15px] text-newt-text-primary outline-none placeholder:text-newt-text-muted"
          />
        </div>
        {actions}
        <button
          type="button"
          aria-label="Send message"
          disabled={!hasValue}
          onClick={submit}
          /* The send control only lights up once there is something to send. */
          className={cn(composerButton, hasValue && "text-newt-brand")}
        >
          <SendIcon />
        </button>
      </div>
    )
  }
)
MessageComposer.displayName = "MessageComposer"

export { MessageComposer }
