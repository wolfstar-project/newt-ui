"use client"

import * as React from "react"

import { Slider } from "@/registry/bases/newt/ui/slider"

const LEVELS = [
  { value: 0, label: "Off" },
  { value: 1, label: "Low" },
  { value: 2, label: "Medium" },
  { value: 3, label: "High" },
]

/* A mark at every stop turns the track into a short list of named levels. */
export default function SliderStepsDemo() {
  const [level, setLevel] = React.useState(2)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <span className="text-sm font-semibold text-newt-text-primary">
        Noise suppression
      </span>
      <Slider
        aria-label="Noise suppression"
        aria-valuetext={LEVELS[level]?.label}
        min={0}
        max={3}
        step={1}
        value={level}
        onValueChange={setLevel}
        marks={LEVELS}
      />
    </div>
  )
}
