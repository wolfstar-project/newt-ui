import { cva, type VariantProps } from "class-variance-authority"
import type { ComputedRef, InjectionKey } from "vue"

export { default as ToastProvider } from "./ToastProvider.vue"
export { default as ToastViewport } from "./ToastViewport.vue"
export { default as Toast } from "./Toast.vue"
export { default as ToastIcon } from "./ToastIcon.vue"
export { default as ToastContent } from "./ToastContent.vue"
export { default as ToastTitle } from "./ToastTitle.vue"
export { default as ToastDescription } from "./ToastDescription.vue"
export { default as ToastAction } from "./ToastAction.vue"
export { default as ToastClose } from "./ToastClose.vue"

export const toastVariants = cva(
  [
    "flex max-w-[360px] items-start gap-3 rounded-md border border-newt-border bg-newt-bg-elevated px-3.5 py-3 text-newt-text-primary shadow-elevation-high",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link",
    /* The toast follows the pointer while it is swiped away. */
    "data-[swipe=move]:translate-x-[var(--reka-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-transform data-[swipe=cancel]:duration-fast data-[swipe=cancel]:ease-newt",
  ],
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
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-newt-on-accent",
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

/* The variant of the enclosing toast, which picks the icon's colour and glyph. */
export interface ToastContext {
  variant: ComputedRef<NonNullable<ToastVariants["variant"]>>
}

export const TOAST_INJECTION_KEY: InjectionKey<ToastContext> =
  Symbol("newt-toast")
