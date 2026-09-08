import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
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

export interface SkeletonProps
  extends React.ComponentProps<"div">, VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => (
    <>
      <style>{`@keyframes newt-skeleton-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
      <div
        ref={ref}
        aria-hidden="true"
        data-variant={variant ?? "default"}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    </>
  )
)
Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }
