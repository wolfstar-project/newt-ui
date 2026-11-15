import { cva, type VariantProps } from "class-variance-authority"

export { default as Avatar } from "./Avatar.vue"
export { default as AvatarImage } from "./AvatarImage.vue"
export { default as AvatarFallback } from "./AvatarFallback.vue"

export const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-newt-brand font-semibold text-newt-on-accent",
  {
    variants: {
      size: {
        xs: "h-4 w-4 text-[9px]",
        sm: "h-6 w-6 text-[11px]",
        md: "h-8 w-8 text-[13px]",
        default: "h-10 w-10 text-base",
        lg: "h-20 w-20 text-[28px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export type AvatarVariants = VariantProps<typeof avatarVariants>
