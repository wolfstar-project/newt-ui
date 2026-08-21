import { cva, type VariantProps } from "class-variance-authority"

export { default as Pagination } from "./Pagination.vue"
export { default as PaginationButton } from "./PaginationButton.vue"
export { default as PaginationEllipsis } from "./PaginationEllipsis.vue"
export { default as LoadMore } from "./LoadMore.vue"

export const paginationButtonVariants = cva(
  "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-sm border px-2 text-[13px] font-medium disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      active: {
        false:
          "border-newt-border bg-newt-bg-elevated text-newt-text-secondary hover:bg-newt-bg-hover hover:text-newt-text-primary",
        true: "border-newt-brand bg-newt-brand text-white",
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export type PaginationButtonVariants = VariantProps<
  typeof paginationButtonVariants
>
