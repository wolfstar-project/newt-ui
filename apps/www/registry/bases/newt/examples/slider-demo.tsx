"use client"

import * as React from "react"

import { Slider } from "@/registry/bases/newt/ui/slider"

const MARKS = [
  { value: 0, label: "0%" },
  { value: 100, label: "100%" },
  { value: 200, label: "200%" },
]

export default function SliderDemo() {
  const [volume, setVolume] = React.useState([80])

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-newt-text-primary">
          Output volume
        </span>
        <span className="font-mono text-newt-text-muted">{volume[0]}%</span>
      </div>
      <Slider
        aria-label="Output volume"
        min={0}
        max={200}
        value={volume}
        onValueChange={setVolume}
        marks={MARKS}
      />
    </div>
  )
}
