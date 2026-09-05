import { cva, type VariantProps } from "class-variance-authority"

export { default as Reaction } from "./Reaction.vue"
export { default as ReactionGroup } from "./ReactionGroup.vue"

export const reactionVariants = cva(
  "inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5 text-[13px] transition-[background-color,border-color] duration-fast ease-newt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
  {
    variants: {
      active: {
        false:
          "border-newt-border bg-newt-bg-surface text-newt-text-secondary hover:bg-newt-bg-hover",
        true: "border-newt-brand bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] text-newt-mention-text",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export type ReactionVariants = VariantProps<typeof reactionVariants>
