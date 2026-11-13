import { cva, type VariantProps } from "class-variance-authority"

export { default as Dropdown } from "./Dropdown.vue"
export { default as DropdownTrigger } from "./DropdownTrigger.vue"
export { default as DropdownContent } from "./DropdownContent.vue"
export { default as DropdownGroup } from "./DropdownGroup.vue"
export { default as DropdownLabel } from "./DropdownLabel.vue"
export { default as DropdownItem } from "./DropdownItem.vue"
export { default as DropdownRadioGroup } from "./DropdownRadioGroup.vue"
export { default as DropdownRadioItem } from "./DropdownRadioItem.vue"
export { default as DropdownSeparator } from "./DropdownSeparator.vue"
export { default as DropdownIcon } from "./DropdownIcon.vue"
export { default as DropdownItemText } from "./DropdownItemText.vue"
export { default as DropdownItemLabel } from "./DropdownItemLabel.vue"
export { default as DropdownItemDescription } from "./DropdownItemDescription.vue"

/*
 * `data-highlighted` is the primitive's one state for the pointer and the
 * keyboard, so it takes the place of the old `:hover` rule.
 */
export const dropdownItemVariants = cva(
  "group flex cursor-pointer select-none items-center gap-2.5 rounded-sm px-2.5 py-2 outline-none transition-colors duration-fast ease-newt data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      variant: {
        default: "data-[highlighted]:bg-newt-brand",
        danger:
          "text-newt-danger data-[highlighted]:bg-newt-danger data-[highlighted]:text-newt-on-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type DropdownItemVariants = VariantProps<typeof dropdownItemVariants>
