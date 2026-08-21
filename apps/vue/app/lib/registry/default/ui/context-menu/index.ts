import { cva, type VariantProps } from "class-variance-authority"

export { default as ContextMenu } from "./ContextMenu.vue"
export { default as ContextMenuItem } from "./ContextMenuItem.vue"
export { default as ContextMenuShortcut } from "./ContextMenuShortcut.vue"
export { default as ContextMenuDivider } from "./ContextMenuDivider.vue"

export const contextMenuItemVariants = cva(
  "group flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-[13px] transition-colors duration-fast ease-newt hover:text-white",
  {
    variants: {
      variant: {
        default: "text-newt-text-secondary hover:bg-newt-brand",
        danger: "text-newt-dnd hover:bg-newt-dnd",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type ContextMenuItemVariants = VariantProps<
  typeof contextMenuItemVariants
>
