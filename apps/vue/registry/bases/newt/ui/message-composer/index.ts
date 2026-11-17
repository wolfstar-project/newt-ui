import { cva, type VariantProps } from "class-variance-authority"

export { default as MessageComposer } from "./MessageComposer.vue"

export const messageComposerVariants = cva(
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

export const messageComposerFieldVariants = cva(
  "flex min-w-0 flex-1 items-center gap-2",
  {
    variants: {
      layout: {
        default: "",
        narrow: "min-h-10 rounded-full bg-newt-bg-input-elevated pe-1 ps-4",
      },
    },
    defaultVariants: { layout: "default" },
  }
)

/**
 * The style of the composer's icon buttons. Give it to a button you add, so
 * it matches the built-in ones. In the narrow layout, use `layout: "narrow"`
 * for a button beside the field and the default for one inside it.
 */
export const messageComposerButtonVariants = cva(
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

/** The composer's own names. Pass `labels` to translate them. */
export interface MessageComposerLabels {
  /** Accessible name of the whole bar, built from the channel name. */
  group: (channelName: string) => string
  /** Placeholder and name of the field, when `placeholder` is not set. */
  placeholder: (channelName: string) => string
  /** Accessible name of the add button. */
  add: string
  /** Accessible name of the send button. */
  send: string
}

/** The English defaults. */
export const defaultMessageComposerLabels: MessageComposerLabels = {
  group: (channelName) => `Message composer for #${channelName}`,
  placeholder: (channelName) => `Message #${channelName}`,
  add: "Add attachment",
  send: "Send message",
}

export type MessageComposerLayout = NonNullable<
  VariantProps<typeof messageComposerVariants>["layout"]
>

/** Attributes for the focusable field. Bind them on it with `v-bind`. */
export interface MessageComposerInputAttributes {
  placeholder: string
  "aria-label": string
  role: "combobox" | undefined
  autocomplete: "off" | undefined
  "aria-controls": string | undefined
  "aria-expanded": boolean | undefined
  "aria-activedescendant": string | undefined
  disabled: boolean
  spellcheck: false
  /** Enter submits, Escape and the arrow keys reach their events. */
  onKeydown: (event: KeyboardEvent) => void
}

/** What the `#input` slot receives: the state of the built-in input. */
export interface MessageComposerInputProps {
  value: string
  /** Changes the value, as typing in the built-in input does. */
  setValue: (value: string) => void
  /** Sends the value, as Enter does. Does nothing while it is empty. */
  submit: () => void
  disabled: boolean
  inputProps: MessageComposerInputAttributes
}
