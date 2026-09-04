"use client"

import * as React from "react"

import { Avatar } from "@/registry/default/ui/avatar"
import { Chat, ChatBody, ChatFooter } from "@/registry/default/ui/chat"
import { MessageComposer } from "@/registry/default/ui/message-composer"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "@/registry/default/ui/message-group"
import { MessageList } from "@/registry/default/ui/message-list"

export default function ChatDemo() {
  const [value, setValue] = React.useState("")

  return (
    <Chat aria-label="#general channel chat" className="h-80 w-full max-w-md">
      <ChatBody focusable viewportLabel="#general channel messages">
        <MessageList label="Messages in #general">
          <MessageGroup>
            <MessageGroupAvatar>
              <Avatar>U</Avatar>
            </MessageGroupAvatar>
            <MessageGroupBody>
              <MessageGroupHeader>
                <MessageGroupAuthor>username</MessageGroupAuthor>
                <MessageGroupTime dateTime="2026-09-04T14:23:00.000Z">
                  Today at 14:23
                </MessageGroupTime>
              </MessageGroupHeader>
              <MessageGroupContent>Welcome to the channel.</MessageGroupContent>
            </MessageGroupBody>
          </MessageGroup>
        </MessageList>
      </ChatBody>
      <ChatFooter>
        <MessageComposer
          channelName="general"
          value={value}
          onValueChange={setValue}
          onSubmit={() => setValue("")}
        />
      </ChatFooter>
    </Chat>
  )
}
