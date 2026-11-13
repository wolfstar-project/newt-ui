import { cva, type VariantProps } from "class-variance-authority"

export { default as ContextMenu } from "./ContextMenu.vue"
export { default as ContextMenuTrigger } from "./ContextMenuTrigger.vue"
export { default as ContextMenuContent } from "./ContextMenuContent.vue"
export { default as ContextMenuGroup } from "./ContextMenuGroup.vue"
export { default as ContextMenuLabel } from "./ContextMenuLabel.vue"
export { default as ContextMenuItem } from "./ContextMenuItem.vue"
export { default as ContextMenuShortcut } from "./ContextMenuShortcut.vue"
export { default as ContextMenuSeparator } from "./ContextMenuSeparator.vue"

/*
 * `data-highlighted` is the primitive's one state for the pointer and the
 * keyboard, so it takes the place of the old `:hover` rule.
 */
export const contextMenuItemVariants = cva(
  "group flex cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-[13px] outline-none transition-colors duration-fast ease-newt data-[highlighted]:text-newt-on-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "text-newt-text-secondary data-[highlighted]:bg-newt-brand",
        danger: "text-newt-dnd data-[highlighted]:bg-newt-dnd",
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
