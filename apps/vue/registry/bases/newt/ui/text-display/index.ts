import { cva, type VariantProps } from "class-variance-authority"

export { default as TextDisplay } from "./TextDisplay.vue"

/*
 * The sizes are the chat markdown ones, so a text display and a `Markdown`
 * message agree: `#` is 24px, `##` is 20px, `###` is 16px and `-#` subtext
 * is 13px in the muted colour. `default` keeps the size and colour of the
 * container around it.
 */
export const textDisplayVariants = cva(
  "m-0 min-w-0 whitespace-pre-line break-words [overflow-wrap:anywhere]",
  {
    variants: {
      size: {
        default: "",
        "heading-1":
          "text-2xl font-bold leading-[1.375] text-newt-text-primary",
        "heading-2": "text-xl font-bold leading-[1.375] text-newt-text-primary",
        "heading-3":
          "text-base font-bold leading-[1.375] text-newt-text-primary",
        subtext: "text-[13px] leading-[1.3] text-newt-text-muted",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export type TextDisplayVariants = VariantProps<typeof textDisplayVariants>
