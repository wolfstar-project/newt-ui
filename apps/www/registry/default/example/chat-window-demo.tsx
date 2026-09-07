import { ChatWindow } from "@/registry/default/block/chat-window/chat-window"

/* Placeholder names and text: no real account, and no Discord asset. */
const MESSAGES = [
  {
    id: "1",
    author: "username",
    initials: "U",
    body: "Welcome to the channel.",
    sentAt: "2026-09-07T14:23:00.000Z",
    displayTime: "Today at 14:23",
  },
  {
    id: "2",
    author: "someone",
    initials: "S",
    body: "The deploy finished — logs look clean.",
    sentAt: "2026-09-07T14:25:00.000Z",
    displayTime: "Today at 14:25",
  },
] as const

export default function ChatWindowDemo() {
  return (
    <ChatWindow
      className="w-full max-w-lg"
      channelName="general"
      topic="Say hello and tell us what you are building."
      messages={MESSAGES}
    />
  )
}
