import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap border-0 font-sans font-medium leading-4 transition-[background-color,color,box-shadow] duration-fast ease-newt active:translate-y-[0.5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-newt-brand text-white hover:bg-newt-brand-hover active:bg-newt-brand-active",
        secondary:
          "bg-newt-bg-elevated text-newt-text-primary hover:bg-newt-bg-hover",
        danger: "bg-newt-danger text-white hover:bg-newt-danger-hover",
        success: "bg-newt-online text-white hover:brightness-90",
        link: "bg-transparent text-newt-text-link hover:underline",
        icon: "bg-newt-bg-elevated text-newt-text-secondary hover:bg-newt-bg-hover hover:text-newt-text-primary",
      },
      size: {
        default: "rounded-sm px-4 py-2.5 text-sm",
        sm: "rounded-sm px-3 py-1.5 text-[13px]",
        lg: "rounded-sm px-6 py-3 text-base",
        icon: "rounded-full p-2 text-sm",
      },
    },
    compoundVariants: [
      { variant: "link", size: "default", class: "px-0 py-1" },
      { variant: "link", size: "sm", class: "px-0 py-1" },
      { variant: "link", size: "lg", class: "px-0 py-1" },
      { variant: "icon", size: "default", class: "rounded-full p-2" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
