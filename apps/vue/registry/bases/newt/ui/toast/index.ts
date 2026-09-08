import { cva, type VariantProps } from "class-variance-authority"
import type { ComputedRef, InjectionKey } from "vue"

export { default as Toast } from "./Toast.vue"
export { default as ToastIcon } from "./ToastIcon.vue"
export { default as ToastContent } from "./ToastContent.vue"
export { default as ToastTitle } from "./ToastTitle.vue"
export { default as ToastDescription } from "./ToastDescription.vue"
export { default as ToastClose } from "./ToastClose.vue"

export const toastVariants = cva(
  "flex max-w-[360px] items-start gap-3 rounded-md border border-newt-border bg-newt-bg-elevated px-3.5 py-3 text-newt-text-primary shadow-elevation-high",
  {
    variants: {
      variant: {
        success: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

export const toastIconVariants = cva(
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-white",
  {
    variants: {
      variant: {
        success: "bg-newt-online",
        error: "bg-newt-dnd",
      },
    },
    defaultVariants: {
      variant: "success",
    },
  }
)

export type ToastVariants = VariantProps<typeof toastVariants>

export interface ToastContext {
  variant: ComputedRef<NonNullable<ToastVariants["variant"]>>
  close: () => void
}

export const TOAST_INJECTION_KEY: InjectionKey<ToastContext> =
  Symbol("newt-toast")
