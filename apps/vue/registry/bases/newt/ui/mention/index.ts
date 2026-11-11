import { cva, type VariantProps } from "class-variance-authority"

export { default as Mention } from "./Mention.vue"

/*
 * Every variant only sets two custom properties: the tint the chip renders at
 * rest and the solid colour it fills with on hover. A role mention overrides
 * `--newt-mention-color` inline with the role's own hue, and its hover fill
 * follows automatically.
 */
export const mentionVariants = cva(
  "inline-flex min-h-[22px] items-center gap-0.5 rounded-sm border-0 bg-[color-mix(in_srgb,var(--newt-mention-color)_15%,transparent)] px-1 align-middle font-sans text-[14px] font-medium leading-5 text-[var(--newt-mention-color)] no-underline transition-colors duration-fast ease-newt",
  {
    variants: {
      variant: {
        user: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
        channel:
          "[--newt-mention-color:var(--newt-text-link)] [--newt-mention-solid:var(--newt-brand)]",
        role: "[--newt-mention-color:var(--newt-mention-role)] [--newt-mention-solid:var(--newt-mention-color)]",
        app: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
      },
      /*
       * A mention that opens nothing (`as="span"`) keeps the tint but drops
       * the pointer, the hover fill and the focus ring: it is text, not a
       * control, and stays out of the tab order.
       */
      interactive: {
        true: "cursor-pointer hover:bg-[var(--newt-mention-solid)] hover:text-newt-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
        false: "",
      },
    },
    defaultVariants: {
      variant: "user",
      interactive: true,
    },
  }
)

export type MentionVariants = VariantProps<typeof mentionVariants>

/** The element a mention renders as. */
export type MentionElement = "button" | "a" | "span"
