import { cva, type VariantProps } from "class-variance-authority"

export { default as Progress } from "./Progress.vue"
export { default as ProgressLabel } from "./ProgressLabel.vue"

export const progressVariants = cva(
  "h-full rounded-full transition-[width] duration-base ease-newt",
  {
    variants: {
      variant: {
        default: "bg-[linear-gradient(90deg,var(--newt-brand),#8c54ff)]",
        success: "bg-[linear-gradient(90deg,var(--newt-online),#45c178)]",
        danger: "bg-[linear-gradient(90deg,var(--newt-dnd),#f4878a)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type ProgressVariants = VariantProps<typeof progressVariants>
