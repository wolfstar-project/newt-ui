import { cva, type VariantProps } from "class-variance-authority"

export { default as CustomEmoji } from "./CustomEmoji.vue"

/*
 * A custom emoji is an image that has to behave like a letter: it sits on the
 * text baseline and carries its name as its accessible text, so a reader who
 * cannot see it still hears `:name:`.
 *
 * A message made only of emoji renders them large — that is the `jumbo` size,
 * and it is a property of the message, not of the emoji.
 */
export const customEmojiVariants = cva(
  "inline-block object-contain align-[-0.2em]",
  {
    variants: {
      size: {
        inline: "h-[1.375em] w-[1.375em]",
        jumbo: "h-12 w-12",
      },
    },
    defaultVariants: { size: "inline" },
  }
)

export type CustomEmojiVariants = VariantProps<typeof customEmojiVariants>
