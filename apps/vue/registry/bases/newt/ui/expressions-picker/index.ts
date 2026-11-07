import { cva } from "class-variance-authority"
export { default as ExpressionsPicker } from "./ExpressionsPicker.vue"
export type ExpressionKind = "emoji" | "sticker" | "gif"

/** IDs must be unique across all three kinds. Media previews must be static. */
export type ExpressionItem = {
  id: string
  label: string
  keywords?: readonly string[]
  disabled?: boolean
} & (
  | { kind: "emoji"; value: string; previewSrc?: never }
  | { kind: "sticker" | "gif"; value: string; previewSrc?: string }
)

export const expressionsPickerVariants = cva(
  "min-h-[var(--newt-expressions-target-size)] cursor-pointer rounded-sm border border-newt-border bg-newt-bg-elevated px-[var(--newt-space-3)] py-[var(--newt-space-2)] font-sans text-[length:var(--newt-font-size-sm)] leading-[var(--newt-line-height-normal)] text-newt-text-primary enabled:hover:bg-newt-bg-hover enabled:active:bg-newt-bg-active focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:text-newt-text-muted",
  {
    variants: {
      selected: {
        true: "underline underline-offset-[var(--newt-space-1)] bg-newt-bg-active",
        false: "",
      },
    },
    defaultVariants: { selected: false },
  }
)
