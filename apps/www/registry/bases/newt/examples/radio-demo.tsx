"use client"

import * as React from "react"

import { Radio, RadioGroup } from "@/registry/bases/newt/ui/radio"

export default function RadioDemo() {
  const [mode, setMode] = React.useState("voice-activity")

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <RadioGroup label="Input mode" value={mode} onValueChange={setMode}>
        <Radio value="voice-activity">Voice Activity</Radio>
        <Radio value="push-to-talk">Push to Talk</Radio>
      </RadioGroup>

      <RadioGroup label="Who can reply" defaultValue="everyone">
        <Radio
          value="everyone"
          description="Anyone in the channel can reply to this message."
        >
          Everyone
        </Radio>
        <Radio
          value="nobody"
          description="Replies are turned off for this message."
          disabled
        >
          Nobody
        </Radio>
      </RadioGroup>
    </div>
  )
}
