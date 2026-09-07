import { cva, type VariantProps } from "class-variance-authority"

export { default as Timeline } from "./Timeline.vue"
export { default as TimelineItem } from "./TimelineItem.vue"
export { default as TimelineDot } from "./TimelineDot.vue"
export { default as TimelineContent } from "./TimelineContent.vue"
export { default as TimelineTitle } from "./TimelineTitle.vue"
export { default as TimelineMeta } from "./TimelineMeta.vue"

export const timelineDotVariants = cva(
  "z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-newt-border bg-newt-bg-surface text-xs",
  {
    variants: {
      variant: {
        default: "",
        success: "border-newt-online text-newt-online",
        danger: "border-newt-dnd text-newt-dnd",
        brand: "border-newt-brand text-newt-mention-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type TimelineDotVariants = VariantProps<typeof timelineDotVariants>
