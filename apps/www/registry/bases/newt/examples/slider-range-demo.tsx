"use client"

import * as React from "react"

import { Slider } from "@/registry/bases/newt/ui/slider"

export default function SliderRangeDemo() {
  const [bitrate, setBitrate] = React.useState(64)

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold text-newt-text-primary">Bitrate</span>
        <span className="font-mono text-newt-text-muted">{bitrate} kbps</span>
      </div>
      <Slider
        aria-label="Bitrate"
        aria-valuetext={`${bitrate} kilobits per second`}
        min={8}
        max={96}
        step={8}
        value={bitrate}
        onValueChange={setBitrate}
      />
    </div>
  )
}
