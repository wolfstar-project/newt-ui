"use client"

import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastTitle,
} from "@/registry/default/ui/toast"

export default function ToastDemo() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-4">
      <Toast key={key} variant="success" duration={5000}>
        <ToastIcon />
        <ToastContent>
          <ToastTitle>Success title</ToastTitle>
          <ToastDescription>Description text.</ToastDescription>
        </ToastContent>
        <ToastClose />
      </Toast>
      <button
        type="button"
        className="rounded-sm bg-newt-brand px-3 py-1.5 text-sm font-medium text-white transition-colors duration-fast ease-newt hover:bg-newt-brand-hover"
        onClick={() => setKey((k) => k + 1)}
      >
        Show toast again
      </button>
    </div>
  )
}
