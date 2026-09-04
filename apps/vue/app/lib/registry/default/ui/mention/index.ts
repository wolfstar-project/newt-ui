import { cva, type VariantProps } from "class-variance-authority"

export { default as Mention } from "./Mention.vue"

/*
 * Every variant only sets two custom properties: the tint the chip renders at
 * rest and the solid colour it fills with on hover. A role mention overrides
 * `--newt-mention-color` inline with the role's own hue, and its hover fill
 * follows automatically.
 */
export const mentionVariants = cva(
  "inline-flex min-h-[22px] cursor-pointer items-center gap-0.5 rounded-sm border-0 bg-[color-mix(in_srgb,var(--newt-mention-color)_15%,transparent)] px-1 align-middle font-sans text-[14px] font-medium leading-5 text-[var(--newt-mention-color)] transition-colors duration-fast ease-newt hover:bg-[var(--newt-mention-solid)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
  {
    variants: {
      variant: {
        user: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
        channel:
          "[--newt-mention-color:var(--newt-text-link)] [--newt-mention-solid:var(--newt-brand)]",
        role: "[--newt-mention-color:var(--newt-mention-role)] [--newt-mention-solid:var(--newt-mention-color)]",
        app: "[--newt-mention-color:var(--newt-mention-text)] [--newt-mention-solid:var(--newt-brand)]",
      },
    },
    defaultVariants: {
      variant: "user",
    },
  }
)

export type MentionVariants = VariantProps<typeof mentionVariants>
