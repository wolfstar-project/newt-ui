"use client"

import * as React from "react"

import { MessageComposer } from "@/registry/default/ui/message-composer"

export default function MessageComposerDemo() {
  const [value, setValue] = React.useState("")

  return (
    <MessageComposer
      channelName="general"
      value={value}
      onValueChange={setValue}
      onSubmit={() => setValue("")}
      className="w-full max-w-md"
    />
  )
}
