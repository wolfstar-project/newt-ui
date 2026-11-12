"use client"

import * as React from "react"

import { Checkbox, Switch } from "@/registry/bases/newt/ui/form-fields"

/*
 * A switch takes effect at once; a checkbox is an answer that waits for the
 * form around it. Both are buttons, so each needs a name of its own.
 */
export default function FormFieldsTogglesDemo() {
  const [previews, setPreviews] = React.useState(true)
  const [remember, setRemember] = React.useState(true)

  return (
    <div className="flex w-full max-w-sm flex-col gap-4 text-sm text-newt-text-primary">
      <div className="flex items-center justify-between gap-4">
        <span id="newt-toggle-previews">Show link previews</span>
        <Switch
          aria-labelledby="newt-toggle-previews"
          checked={previews}
          onCheckedChange={setPreviews}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <span id="newt-toggle-streamer" className="text-newt-text-muted">
          Streamer mode (set by your server)
        </span>
        <Switch aria-labelledby="newt-toggle-streamer" disabled />
      </div>
      <div className="flex items-center gap-3">
        <Checkbox
          aria-labelledby="newt-toggle-remember"
          checked={remember}
          onCheckedChange={setRemember}
        />
        <span id="newt-toggle-remember">Remember this device</span>
      </div>
      <div className="flex items-center gap-3">
        <Checkbox aria-labelledby="newt-toggle-beta" disabled />
        <span id="newt-toggle-beta" className="text-newt-text-muted">
          Join the beta (invite only)
        </span>
      </div>
    </div>
  )
}
