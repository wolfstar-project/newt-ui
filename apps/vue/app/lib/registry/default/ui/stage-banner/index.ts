import { cva, type VariantProps } from "class-variance-authority"
import type { InjectionKey } from "vue"

export { default as StageBanner } from "./StageBanner.vue"
export { default as StageBannerDot } from "./StageBannerDot.vue"
export { default as StageBannerAction } from "./StageBannerAction.vue"
export { default as StageBannerClose } from "./StageBannerClose.vue"

export const stageBannerVariants = cva(
  "group flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium",
  {
    variants: {
      variant: {
        brand: "bg-newt-brand text-white",
        neutral:
          "border border-newt-border bg-newt-bg-elevated text-newt-text-primary",
      },
    },
    defaultVariants: {
      variant: "brand",
    },
  }
)

export const stageBannerDotVariants = cva("h-2 w-2 shrink-0 rounded-full", {
  variants: {
    status: {
      white: "bg-white",
      online: "bg-newt-online",
      idle: "bg-newt-idle",
      dnd: "bg-newt-dnd",
      offline: "bg-newt-offline",
    },
  },
  defaultVariants: {
    status: "white",
  },
})

export type StageBannerVariants = VariantProps<typeof stageBannerVariants>
export type StageBannerDotVariants = VariantProps<typeof stageBannerDotVariants>

export interface StageBannerContext {
  close: () => void
}

export const STAGE_BANNER_INJECTION_KEY: InjectionKey<StageBannerContext> =
  Symbol("newt-stage-banner")
