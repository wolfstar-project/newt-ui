import { cva, type VariantProps } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold leading-4",
  {
    variants: {
      variant: {
        default: "bg-newt-bg-elevated text-newt-text-secondary",
        brand: "bg-[rgba(88,101,242,0.15)] text-[#b3baff]",
        success: "bg-[rgba(35,165,90,0.15)] text-[#45c178]",
        warning: "bg-[rgba(240,178,50,0.15)] text-[#f3b95f]",
        danger: "bg-[rgba(242,63,66,0.15)] text-[#f4878a]",
      },
      dot: {
        true: "before:h-1.5 before:w-1.5 before:rounded-full before:bg-current before:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      dot: false,
    },
  }
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
