"use client"

import * as React from "react"

import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/registry/bases/newt/ui/toast"

/*
 * `static` keeps the viewport in the page flow, so the toast shows inside
 * the preview. An application leaves the class out and the toasts float in
 * the corner of the screen.
 */
export default function ToastDemo() {
  const [key, setKey] = React.useState(0)

  return (
    <ToastProvider>
      <div className="flex flex-col items-start gap-4">
        <ToastViewport className="static items-start" />
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
    </ToastProvider>
  )
}
