"use client"

import * as React from "react"

import { MessageComposer } from "@/registry/bases/newt/ui/message-composer"
import { SlashCommand } from "@/registry/bases/newt/ui/slash-command"

/*
 * A field of its own: the command as a chip, then an input for its last
 * option. Enter still submits, and the send button still follows the value.
 */
export default function MessageComposerInputDemo() {
  const [reason, setReason] = React.useState("")

  return (
    <MessageComposer
      channelName="moderation"
      placeholder="Reason for the ban"
      value={reason}
      onValueChange={setReason}
      onSubmit={() => setReason("")}
      className="w-full max-w-md"
      renderInput={({ value, setValue, inputProps }) => (
        <>
          <SlashCommand
            name="ban"
            subcommand="member"
            options={[{ name: "user", value: "@username" }]}
            className="shrink-0"
          />
          <input
            type="text"
            {...inputProps}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="w-full min-w-0 border-0 bg-transparent font-sans text-[15px] text-newt-text-primary outline-none placeholder:text-newt-text-muted"
          />
        </>
      )}
    />
  )
}
