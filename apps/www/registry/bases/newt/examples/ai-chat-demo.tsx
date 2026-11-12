"use client"

import * as React from "react"

import {
  AiChat,
  type AiChatMessage,
} from "@/registry/bases/newt/blocks/ai-chat/ai-chat"

/*
 * No model is called here. The reply is canned and arrives after a pause, so
 * the demo shows the three states the block has — the prompts, the wait and
 * the exchange — without a key or a network.
 */
const REPLY = `Here is a starting point:
- **Name the server** after what people will do there
- Start with three channels: \`#welcome\`, \`#general\`, \`#help\`
- Add a role only when someone needs a permission the others do not

Want me to draft the welcome message too?`

const SUGGESTIONS = [
  "Plan a community server",
  "Write a welcome message",
  "Explain roles and permissions",
]

/* A fixed clock, so the server render and the first client render agree. */
const SENT_AT = "2026-09-07T14:23:00.000Z"
const DISPLAY_TIME = "Today at 14:23"

export default function AiChatDemo() {
  const [messages, setMessages] = React.useState<readonly AiChatMessage[]>([])
  const [pending, setPending] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const send = (body: string) => {
    setMessages((current) => [
      ...current,
      {
        id: `user-${current.length}`,
        role: "user",
        body,
        sentAt: SENT_AT,
        displayTime: DISPLAY_TIME,
      },
    ])
    setPending(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${current.length}`,
          role: "assistant",
          body: REPLY,
          sentAt: SENT_AT,
          displayTime: DISPLAY_TIME,
        },
      ])
      setPending(false)
    }, 1200)
  }

  return (
    <AiChat
      className="w-full max-w-lg"
      assistantName="Newt"
      caption="Answers from your own model"
      messages={messages}
      pending={pending}
      suggestions={SUGGESTIONS}
      onSend={send}
    />
  )
}
