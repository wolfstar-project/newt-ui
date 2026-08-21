import { cva, type VariantProps } from "class-variance-authority"

export { default as ServerBanner } from "./ServerBanner.vue"
export { default as ServerBannerIcon } from "./ServerBannerIcon.vue"
export { default as ServerBannerInfo } from "./ServerBannerInfo.vue"
export { default as ServerBannerName } from "./ServerBannerName.vue"
export { default as ServerBannerMeta } from "./ServerBannerMeta.vue"
export { default as ServerBannerMetaItem } from "./ServerBannerMetaItem.vue"

export const serverBannerDotVariants = cva("h-2 w-2 shrink-0 rounded-full", {
  variants: {
    status: {
      online: "bg-newt-online",
      offline: "bg-newt-offline",
    },
  },
  defaultVariants: {
    status: "offline",
  },
})

export type ServerBannerDotVariants = VariantProps<
  typeof serverBannerDotVariants
>
