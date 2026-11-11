import { cva, type VariantProps } from "class-variance-authority"

export { default as Alert } from "./Alert.vue"
export { default as AlertTitle } from "./AlertTitle.vue"
export { default as AlertDescription } from "./AlertDescription.vue"
export { default as AlertActions } from "./AlertActions.vue"

export const alertVariants = cva(
  "flex w-full items-start gap-3 rounded-sm border border-s-4 border-newt-border bg-newt-bg-surface px-3.5 py-3 text-sm leading-5 text-newt-text-secondary",
  {
    variants: {
      variant: {
        info: "border-s-newt-text-link [&>svg]:text-newt-text-link",
        success: "border-s-newt-online [&>svg]:text-newt-online",
        warning: "border-s-newt-idle [&>svg]:text-newt-idle",
        danger: "border-s-newt-danger [&>svg]:text-newt-danger",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

export type AlertVariants = VariantProps<typeof alertVariants>
