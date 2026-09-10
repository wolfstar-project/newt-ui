import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

/*
 * A custom emoji is an image that has to behave like a letter: it sits on the
 * text baseline, it takes the line's colour nowhere, and it carries its name
 * as its accessible text so a reader who cannot see it still hears `:name:`.
 *
 * A message made only of emoji renders them large — that is the `jumbo` size,
 * and it is a property of the message, not of the emoji.
 */
const customEmojiVariants = cva("inline-block object-contain align-[-0.2em]", {
  variants: {
    size: {
      inline: "h-[1.375em] w-[1.375em]",
      jumbo: "h-12 w-12",
    },
  },
  defaultVariants: { size: "inline" },
})

export interface CustomEmojiProps
  extends
    Omit<React.ImgHTMLAttributes<HTMLImageElement>, "alt">,
    VariantProps<typeof customEmojiVariants> {
  /** The name between the colons, without them. */
  name: string
}

const CustomEmoji = React.forwardRef<HTMLImageElement, CustomEmojiProps>(
  ({ className, name, size, ...props }, ref) => (
    <img
      ref={ref}
      /*
       * `:name:` rather than the bare name: it is what the author typed, and
       * it reads as an emoji rather than as a stray word in the sentence.
       */
      alt={`:${name}:`}
      title={`:${name}:`}
      draggable={false}
      className={cn(customEmojiVariants({ size }), className)}
      {...props}
    />
  )
)
CustomEmoji.displayName = "CustomEmoji"

export { CustomEmoji, customEmojiVariants }
