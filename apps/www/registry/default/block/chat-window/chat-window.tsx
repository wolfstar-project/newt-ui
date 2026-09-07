"use client"

import * as React from "react"

import { Avatar } from "@/registry/default/ui/avatar"
import {
  ChannelHeader,
  ChannelHeaderDivider,
  ChannelHeaderIcon,
  ChannelHeaderInfo,
  ChannelHeaderName,
  ChannelHeaderTopic,
} from "@/registry/default/ui/channel-header"
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

/*
 * A whole channel view: header, scrolling message list, composer. Everything
 * here is composed from registry components — the block is the arrangement,
 * not new markup, so restyling it is still a matter of overriding a token.
 *
 * `messages` is deliberately a plain array. A block does not know your data
 * layer; map onto this shape at the edge of it.
 */
export interface ChatMessage {
  id: string
  author: string
  /** The initials the avatar shows. */
  initials: string
  body: string
  sentAt: string
  /** Rendered timestamp; the ISO value goes in `sentAt`. */
  displayTime: string
}

export interface ChatWindowProps extends React.ComponentProps<"div"> {
  channelName: string
  topic?: string
  messages: readonly ChatMessage[]
  onSend?: (message: string) => void
}

export function ChatWindow({
  channelName,
  topic,
  messages,
  onSend,
  className,
  ...props
}: ChatWindowProps) {
  const [value, setValue] = React.useState("")

  return (
    <div className={className} {...props}>
      <ChannelHeader>
        <ChannelHeaderInfo>
          <ChannelHeaderIcon />
          <ChannelHeaderName>{channelName}</ChannelHeaderName>
          {topic && (
            <>
              <ChannelHeaderDivider />
              <ChannelHeaderTopic>{topic}</ChannelHeaderTopic>
            </>
          )}
        </ChannelHeaderInfo>
      </ChannelHeader>

      <Chat aria-label={`#${channelName} chat`} className="h-96">
        <ChatBody focusable viewportLabel={`#${channelName} messages`}>
          <MessageList label={`Messages in #${channelName}`}>
            {messages.map((message) => (
              <MessageGroup key={message.id}>
                <MessageGroupAvatar>
                  <Avatar>{message.initials}</Avatar>
                </MessageGroupAvatar>
                <MessageGroupBody>
                  <MessageGroupHeader>
                    <MessageGroupAuthor>{message.author}</MessageGroupAuthor>
                    <MessageGroupTime dateTime={message.sentAt}>
                      {message.displayTime}
                    </MessageGroupTime>
                  </MessageGroupHeader>
                  <MessageGroupContent>{message.body}</MessageGroupContent>
                </MessageGroupBody>
              </MessageGroup>
            ))}
          </MessageList>
        </ChatBody>
        <ChatFooter>
          <MessageComposer
            channelName={channelName}
            value={value}
            onValueChange={setValue}
            onSubmit={(message) => {
              onSend?.(message)
              setValue("")
            }}
          />
        </ChatFooter>
      </Chat>
    </div>
  )
}
