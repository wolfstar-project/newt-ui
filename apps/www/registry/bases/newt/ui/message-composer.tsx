"use client"

import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/* The composer's own English names. Every other text comes from a prop. */
const text = {
  group: (channelName: string) => `Message composer for #${channelName}`,
  placeholder: (channelName: string) => `Message #${channelName}`,
  add: "Add attachment",
  send: "Send message",
}

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

const messageComposerVariants = cva(
  "flex min-w-0 items-center gap-2 text-newt-text-muted",
  {
    variants: {
      layout: {
        default:
          "min-h-11 rounded-[var(--newt-radius-md)] border border-newt-border bg-newt-bg-input-elevated px-4",
        /* A phone: no frame, a pill field, round buttons beside it. */
        narrow: "min-h-10",
      },
    },
    defaultVariants: { layout: "default" },
  }
)

const fieldVariants = cva("flex min-w-0 flex-1 items-center gap-2", {
  variants: {
    layout: {
      default: "",
      narrow: "min-h-10 rounded-full bg-newt-bg-input-elevated pe-1 ps-4",
    },
  },
  defaultVariants: { layout: "default" },
})

/**
 * The style of the composer's icon buttons. Give it to a button you add, so
 * it matches the built-in ones. In the narrow layout, use `layout: "narrow"`
 * for a button beside the field and the default for one inside it.
 */
const messageComposerButtonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center border-0 p-0 text-inherit hover:bg-newt-bg-hover hover:text-newt-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      layout: {
        default: "h-8 w-8 rounded-[var(--newt-radius-sm)] bg-transparent",
        narrow: "h-10 w-10 rounded-full bg-newt-bg-input-elevated",
      },
    },
    defaultVariants: { layout: "default" },
  }
)

/* The send control only lights up once there is something to send. */
const sendReady = {
  default: "text-newt-brand",
  narrow:
    "bg-newt-brand text-newt-on-accent hover:bg-newt-brand-hover hover:text-newt-on-accent",
}

type MessageComposerLayout = NonNullable<
  VariantProps<typeof messageComposerVariants>["layout"]
>

/** Attributes for the focusable field. Spread them on it. */
export interface MessageComposerInputAttributes {
  placeholder: string
  "aria-label": string
  role: "combobox" | undefined
  autoComplete: "off" | undefined
  "aria-controls": string | undefined
  "aria-expanded": boolean | undefined
  "aria-activedescendant": string | undefined
  disabled: boolean
  spellCheck: false
  /** Enter submits, Escape and the arrow keys reach their callbacks. */
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void
}

/** What `renderInput` receives: the state of the built-in input. */
export interface MessageComposerInputProps {
  value: string
  /** Changes the value, as typing in the built-in input does. */
  setValue: (value: string) => void
  /** Sends the value, as Enter does. Does nothing while it is empty. */
  submit: () => void
  disabled: boolean
  inputProps: MessageComposerInputAttributes
}

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
  /** Turns off the input, the add button and the send button. */
  disabled?: boolean
  /** `"narrow"` is the phone layout: a pill field and round buttons. */
  layout?: MessageComposerLayout
  /** Shows the add button. */
  showAdd?: boolean
  onAdd?: () => void
  /** Controls after the add button, before the field. */
  leading?: React.ReactNode
  /**
   * Replaces the built-in input with your own field. It receives the value,
   * a setter, the submit action and the attributes to spread on the field.
   * The Vue port takes the same content through its `#input` slot.
   */
  renderInput?: (props: MessageComposerInputProps) => React.ReactNode
  /** Extra controls at the end of the field, before the send button. */
  actions?: React.ReactNode
  /** Shown in place of the send button while the field is empty. */
  trailing?: React.ReactNode
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
      disabled = false,
      layout = "default",
      showAdd = true,
      onAdd,
      leading,
      renderInput,
      actions,
      trailing,
      ...props
    },
    ref
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
    const current = value ?? uncontrolled
    const hasValue = current.trim().length > 0
    const label = placeholder ?? text.placeholder(channelName)

    const setValue = (next: string) => {
      if (value === undefined) setUncontrolled(next)
      onValueChange?.(next)
    }

    const submit = () => {
      if (!hasValue || disabled) return
      onSubmit?.(current)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
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

    const inputProps: MessageComposerInputAttributes = {
      placeholder: label,
      "aria-label": label,
      role: autocomplete ? "combobox" : undefined,
      autoComplete: autocomplete ? "off" : undefined,
      "aria-controls": autocomplete ? ariaControls : undefined,
      "aria-expanded": autocomplete ? ariaExpanded : undefined,
      "aria-activedescendant": autocomplete ? ariaActiveDescendant : undefined,
      disabled,
      spellCheck: false,
      onKeyDown,
    }

    return (
      <div
        ref={ref}
        role="group"
        aria-label={text.group(channelName)}
        className={cn(messageComposerVariants({ layout }), className)}
        {...props}
      >
        {showAdd && (
          <button
            type="button"
            aria-label={text.add}
            disabled={disabled}
            className={messageComposerButtonVariants({ layout })}
            onClick={onAdd}
          >
            <AddIcon />
          </button>
        )}
        {leading}
        <div className={fieldVariants({ layout })}>
          {renderInput ? (
            renderInput({
              value: current,
              setValue,
              submit,
              disabled,
              inputProps,
            })
          ) : (
            <input
              type="text"
              value={current}
              {...inputProps}
              onChange={(event) => setValue(event.target.value)}
              className="w-full min-w-0 border-0 bg-transparent font-[family-name:var(--newt-font-sans)] text-[15px] text-newt-text-primary outline-none placeholder:text-newt-text-muted disabled:cursor-not-allowed"
            />
          )}
          {actions}
        </div>
        {Boolean(trailing) && !hasValue ? (
          trailing
        ) : (
          <button
            type="button"
            aria-label={text.send}
            disabled={disabled || !hasValue}
            onClick={submit}
            className={cn(
              messageComposerButtonVariants({ layout }),
              hasValue && !disabled && sendReady[layout]
            )}
          >
            <SendIcon />
          </button>
        )}
      </div>
    )
  }
)
MessageComposer.displayName = "MessageComposer"

export { MessageComposer, messageComposerButtonVariants }
