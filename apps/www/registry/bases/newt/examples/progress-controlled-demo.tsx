"use client"

import * as React from "react"

import { Button } from "@/registry/bases/newt/ui/button"
import { Progress, ProgressLabel } from "@/registry/bases/newt/ui/progress"

/*
 * The bar holds no state: it draws the `value` it is given and eases between
 * two of them. Reaching the end is a change of variant, not only of width.
 */
export default function ProgressControlledDemo() {
  const [value, setValue] = React.useState(40)
  const done = value >= 100

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div>
        <ProgressLabel>
          <span>{done ? "Upload complete" : "Uploading clip"}</span>
          <span>{value}%</span>
        </ProgressLabel>
        <Progress
          value={value}
          variant={done ? "success" : "default"}
          aria-label="Upload"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          disabled={done}
          onClick={() => setValue((current) => Math.min(current + 20, 100))}
        >
          Add 20%
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setValue(0)}>
          Start over
        </Button>
      </div>
    </div>
  )
}
