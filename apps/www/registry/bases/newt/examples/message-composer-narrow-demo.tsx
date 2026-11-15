"use client"

import * as React from "react"

import {
  MessageComposer,
  messageComposerButtonVariants,
} from "@/registry/bases/newt/ui/message-composer"

const AppsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z"
    />
  </svg>
)

const EmojiIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM8.5 8a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm7 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM12 18a5.5 5.5 0 0 1-5-3.2h10A5.5 5.5 0 0 1 12 18z"
    />
  </svg>
)

const MicrophoneIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
    <path
      fill="currentColor"
      d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zm-7 9a1 1 0 1 1 2 0 5 5 0 0 0 10 0 1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V21h3a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2h3v-3.07A7 7 0 0 1 5 11z"
    />
  </svg>
)

/* A composer 360px wide, the width it has on a phone. */
export default function MessageComposerNarrowDemo() {
  const [value, setValue] = React.useState("")

  return (
    <div className="w-full max-w-[360px]">
      <MessageComposer
        channelName="general"
        layout="narrow"
        value={value}
        onValueChange={setValue}
        onSubmit={() => setValue("")}
        leading={
          <button
            type="button"
            aria-label="Apps"
            className={messageComposerButtonVariants({ layout: "narrow" })}
          >
            <AppsIcon />
          </button>
        }
        actions={
          <button
            type="button"
            aria-label="Emoji"
            className={messageComposerButtonVariants()}
          >
            <EmojiIcon />
          </button>
        }
        trailing={
          <button
            type="button"
            aria-label="Record a voice message"
            className={messageComposerButtonVariants({ layout: "narrow" })}
          >
            <MicrophoneIcon />
          </button>
        }
      />
    </div>
  )
}
