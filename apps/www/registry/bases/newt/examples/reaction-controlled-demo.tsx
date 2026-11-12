"use client"

import * as React from "react"

import { Reaction, ReactionGroup } from "@/registry/bases/newt/ui/reaction"

const OTHERS = 12

/* The pill reports the toggle; the count is the caller's to keep in step. */
export default function ReactionControlledDemo() {
  const [reacted, setReacted] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-2">
      <ReactionGroup>
        <Reaction
          emoji="👍"
          count={OTHERS + (reacted ? 1 : 0)}
          active={reacted}
          onActiveChange={setReacted}
        />
      </ReactionGroup>
      <p className="m-0 text-xs text-newt-text-muted" aria-live="polite">
        {reacted ? "You reacted" : "You have not reacted"}
      </p>
    </div>
  )
}
