import { cva, type VariantProps } from "class-variance-authority"

export { default as NotifBadge } from "./NotifBadge.vue"

export const notifBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-2 border-newt-bg-base text-[11px] font-bold leading-none text-white",
  {
    variants: {
      variant: {
        default: "h-4 min-w-4 bg-newt-dnd px-1",
        mention: "h-4 min-w-4 bg-newt-dnd px-1",
        unread: "h-2 w-2 min-w-0 bg-newt-text-primary p-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type NotifBadgeVariants = VariantProps<typeof notifBadgeVariants>
