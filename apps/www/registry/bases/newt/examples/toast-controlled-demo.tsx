"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import {
  Toast,
  ToastClose,
  ToastContent,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/registry/bases/newt/ui/toast"

/*
 * The parent owns `open`: an action raises the toast, and the timer or the
 * close button hands `false` back through `onOpenChange`.
 */
export default function ToastControlledDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <ToastProvider>
      <div className="flex min-h-28 flex-col items-start gap-4">
        <Button onClick={() => setOpen(true)}>Copy invite link</Button>
        <ToastViewport className="static items-start" />
        <Toast open={open} onOpenChange={setOpen} duration={3000}>
          <ToastIcon />
          <ToastContent>
            <ToastTitle>Invite link copied</ToastTitle>
          </ToastContent>
          <ToastClose />
        </Toast>
      </div>
    </ToastProvider>
  )
}
