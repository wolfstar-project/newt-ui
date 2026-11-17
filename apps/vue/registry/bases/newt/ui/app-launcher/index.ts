import { cva, type VariantProps } from "class-variance-authority"

export { default as AppLauncher } from "./AppLauncher.vue"
export { default as AppLauncherHandle } from "./AppLauncherHandle.vue"
export { default as AppLauncherHeader } from "./AppLauncherHeader.vue"
export { default as AppLauncherHeaderTitle } from "./AppLauncherHeaderTitle.vue"
export { default as AppLauncherBack } from "./AppLauncherBack.vue"
export { default as AppLauncherSearch } from "./AppLauncherSearch.vue"
export { default as AppLauncherSearchInput } from "./AppLauncherSearchInput.vue"
export { default as AppLauncherBody } from "./AppLauncherBody.vue"
export { default as AppLauncherSection } from "./AppLauncherSection.vue"
export { default as AppLauncherSectionHeader } from "./AppLauncherSectionHeader.vue"
export { default as AppLauncherSectionTitle } from "./AppLauncherSectionTitle.vue"
export { default as AppLauncherViewMore } from "./AppLauncherViewMore.vue"
export { default as AppLauncherList } from "./AppLauncherList.vue"
export { default as AppLauncherItem } from "./AppLauncherItem.vue"
export { default as AppLauncherItemIcon } from "./AppLauncherItemIcon.vue"
export { default as AppLauncherRecents } from "./AppLauncherRecents.vue"
export { default as AppLauncherRecent } from "./AppLauncherRecent.vue"
export { default as AppLauncherPromoCard } from "./AppLauncherPromoCard.vue"

export const appLauncherVariants = cva(
  "flex w-full flex-col overflow-hidden border border-newt-border bg-newt-bg-surface text-newt-text-primary shadow-elevation-high",
  {
    variants: {
      variant: {
        /* The desktop popout, at a fixed size. */
        popout:
          "h-[min(680px,calc(100dvh-2rem))] max-w-[504px] rounded-[var(--newt-radius-md)]",
        /* The bottom sheet: full width, rising from the bottom edge. */
        sheet:
          "h-[var(--newt-app-launcher-sheet-height,90dvh)] max-w-none rounded-t-[var(--newt-radius-lg)] border-b-0",
      },
    },
    defaultVariants: { variant: "popout" },
  }
)

export type AppLauncherVariants = VariantProps<typeof appLauncherVariants>
