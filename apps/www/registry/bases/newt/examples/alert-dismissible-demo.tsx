"use client"

import * as React from "react"

import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "@/registry/bases/newt/ui/alert"
import { Button } from "@/registry/bases/newt/ui/button"

/*
 * The alert keeps no state of its own: the page decides whether it applies,
 * and rendering it again is what makes a screen reader announce it.
 */
export default function AlertDismissibleDemo() {
  const [open, setOpen] = React.useState(true)

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      {open ? (
        <Alert variant="info">
          <AlertTitle>Welcome to the server</AlertTitle>
          <AlertDescription>
            Read the rules channel before you post for the first time.
          </AlertDescription>
          <AlertActions>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Got it
            </Button>
          </AlertActions>
        </Alert>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
          Show the notice again
        </Button>
      )}
    </div>
  )
}
