import { cva, type VariantProps } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap border-0 font-[family-name:var(--newt-font-sans)] font-medium leading-4 transition-[background-color,color,box-shadow] duration-fast ease-newt active:translate-y-[0.5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 no-underline",
  {
    variants: {
      variant: {
        primary:
          "bg-newt-brand text-newt-on-accent hover:bg-newt-brand-hover active:bg-newt-brand-active",
        secondary:
          "bg-newt-bg-elevated text-newt-text-primary hover:bg-newt-bg-hover",
        danger: "bg-newt-danger text-newt-on-accent hover:bg-newt-danger-hover",
        success: "bg-newt-online text-newt-on-accent hover:brightness-90",
        link: "bg-transparent text-newt-text-link hover:underline",
      },
      size: {
        default: "rounded-[var(--newt-radius-sm)] px-4 py-2.5 text-sm",
        sm: "rounded-[var(--newt-radius-sm)] px-3 py-1.5 text-[13px]",
        /*
         * 32px, the height of a button in a message's action row. The height
         * is fixed, so an emoji image, a leading icon or the link variant
         * cannot make one button of the row taller or shorter.
         */
        message: "h-8 rounded-[var(--newt-radius-sm)] px-4 py-0 text-sm",
        lg: "rounded-[var(--newt-radius-sm)] px-6 py-3 text-base",
        icon: "rounded-full p-2 text-sm",
      },
    },
    compoundVariants: [
      { variant: "link", size: "default", class: "px-0 py-1" },
      { variant: "link", size: "sm", class: "px-0 py-1" },
      { variant: "link", size: "message", class: "px-0" },
      { variant: "link", size: "lg", class: "px-0 py-1" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
