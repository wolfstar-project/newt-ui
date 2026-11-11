import { cva, type VariantProps } from "class-variance-authority"

export { default as Reaction } from "./Reaction.vue"
export { default as ReactionGroup } from "./ReactionGroup.vue"

export const reactionVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[13px] transition-[background-color,border-color] duration-fast ease-newt focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
  {
    variants: {
      active: {
        false: "border-newt-border bg-newt-bg-surface text-newt-text-secondary",
        true: "border-newt-brand bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] text-newt-mention-text",
      },
      /* `false` for a read-only reaction: no pointer, no hover. */
      interactive: {
        true: "cursor-pointer",
        false: "cursor-[inherit]",
      },
    },
    compoundVariants: [
      { active: false, interactive: true, class: "hover:bg-newt-bg-hover" },
    ],
    defaultVariants: {
      active: false,
      interactive: true,
    },
  }
)

export type ReactionVariants = VariantProps<typeof reactionVariants>

/** What the accessible name of a reaction is built from. */
export interface ReactionLabelState {
  /** The emoji's text, or `emojiAlt` for an image emoji, or `"Emoji"`. */
  emoji: string
  count: number
  active: boolean
}

/** The English default. Pass `formatLabel` to translate it. */
export function defaultReactionLabel({
  emoji,
  count,
  active,
}: ReactionLabelState): string {
  return `${emoji} reaction, ${count} ${count === 1 ? "person" : "people"}${
    active ? ", you reacted" : ""
  }`
}
