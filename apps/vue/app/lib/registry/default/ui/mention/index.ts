import { cva, type VariantProps } from "class-variance-authority"

export { default as Mention } from "./Mention.vue"

export const mentionVariants = cva(
  "inline-flex cursor-pointer items-center gap-0.5 rounded-sm px-1 text-[14px] font-medium transition-colors duration-fast ease-newt",
  {
    variants: {
      variant: {
        user: "bg-[rgba(88,101,242,0.15)] text-[#b3baff] hover:bg-[rgba(88,101,242,0.3)]",
        channel:
          "bg-[rgba(148,155,164,0.15)] text-newt-text-link hover:bg-[rgba(148,155,164,0.25)]",
        role: "bg-[rgba(240,178,50,0.15)] text-[#f3b95f] hover:bg-[rgba(240,178,50,0.25)]",
      },
    },
    defaultVariants: {
      variant: "user",
    },
  }
)

export type MentionVariants = VariantProps<typeof mentionVariants>
