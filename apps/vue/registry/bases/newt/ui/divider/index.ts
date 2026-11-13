import { cva, type VariantProps } from "class-variance-authority"

export { default as Divider } from "./Divider.vue"

export const dividerVariants = cva(
  "flex items-center gap-3 text-xs font-semibold text-newt-text-muted data-[orientation=vertical]:flex-col data-[orientation=vertical]:self-stretch",
  {
    variants: {
      /* Spacing steps, for stacking dividers inside dense containers. */
      spacing: {
        sm: "my-1 data-[orientation=vertical]:mx-1 data-[orientation=vertical]:my-0",
        md: "my-4 data-[orientation=vertical]:mx-4 data-[orientation=vertical]:my-0",
        lg: "my-6 data-[orientation=vertical]:mx-6 data-[orientation=vertical]:my-0",
      },
      /* Pure spacing: keeps the gap, drops the rules around the label. */
      line: {
        true: "before:h-px before:flex-1 before:bg-newt-border before:content-[''] after:h-px after:flex-1 after:bg-newt-border after:content-[''] data-[orientation=vertical]:before:h-auto data-[orientation=vertical]:before:w-px data-[orientation=vertical]:after:h-auto data-[orientation=vertical]:after:w-px",
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
