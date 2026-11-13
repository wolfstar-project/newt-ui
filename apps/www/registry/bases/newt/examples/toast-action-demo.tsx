"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/registry/bases/newt/ui/toast"

/*
 * A toast that offers a way back must not leave on its own: `duration={0}`
 * keeps it until the reader takes the action or dismisses it.
 */
export default function ToastActionDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <ToastProvider>
      <div className="flex min-h-28 flex-col items-start gap-4">
        <ToastViewport className="static items-start" />
        <Toast open={open} onOpenChange={setOpen} duration={0}>
          <ToastIcon />
          <ToastContent>
            <ToastTitle>Message deleted</ToastTitle>
            <ToastDescription>It is gone for everyone.</ToastDescription>
            <ToastAction altText="Restore the message from its menu" asChild>
              <Button variant="secondary" size="sm" className="mt-2">
                Undo
              </Button>
            </ToastAction>
          </ToastContent>
          <ToastClose />
        </Toast>
        {!open && (
          <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
            Delete another message
          </Button>
        )}
      </div>
    </ToastProvider>
  )
}
