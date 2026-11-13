"use client"

import * as React from "react"

import { Slider } from "@/registry/bases/newt/ui/slider"

/*
 * Two values give two grabbers. The name goes on the group around them, and
 * each grabber keeps its own "Minimum" or "Maximum".
 */
export default function SliderMinMaxDemo() {
  const [members, setMembers] = React.useState([100, 500])

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-newt-text-primary">
          Server size
        </span>
        <span className="font-mono text-newt-text-muted">
          {members[0]} to {members[1]} members
        </span>
      </div>
      <Slider
        aria-label="Server size"
        min={0}
        max={1000}
        step={50}
        minStepsBetweenThumbs={1}
        value={members}
        onValueChange={setMembers}
      />
    </div>
  )
}
