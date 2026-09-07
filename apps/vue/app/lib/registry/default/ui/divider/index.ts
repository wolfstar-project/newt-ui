import { cva, type VariantProps } from "class-variance-authority"

export { default as Divider } from "./Divider.vue"

export const dividerVariants = cva(
  "flex items-center gap-3 text-xs font-semibold text-newt-text-muted",
  {
    variants: {
      /* Spacing steps, for stacking dividers inside dense containers. */
      spacing: {
        sm: "my-1",
        md: "my-4",
        lg: "my-6",
      },
      /* Pure spacing: keeps the gap, drops the rules around the label. */
      line: {
        true: "before:h-px before:flex-1 before:bg-newt-border before:content-[''] after:h-px after:flex-1 after:bg-newt-border after:content-['']",
        false: "",
      },
    },
    defaultVariants: {
      spacing: "md",
      line: true,
    },
  }
)

export type DividerVariants = VariantProps<typeof dividerVariants>
