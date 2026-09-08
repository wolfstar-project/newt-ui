import { cva, type VariantProps } from "class-variance-authority"

export { default as Skeleton } from "./Skeleton.vue"

export const skeletonVariants = cva(
  "animate-[newt-skeleton-shimmer_1.6s_ease-in-out_infinite] rounded-sm bg-[linear-gradient(90deg,var(--newt-bg-elevated)_25%,var(--newt-bg-hover)_50%,var(--newt-bg-elevated)_75%)] bg-[length:200%_100%] motion-reduce:animate-none motion-reduce:opacity-60",
  {
    variants: {
      variant: {
        default: "",
        text: "h-[14px]",
        avatar: "h-10 w-10 rounded-full",
        title: "h-5 w-[40%]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type SkeletonVariants = VariantProps<typeof skeletonVariants>
