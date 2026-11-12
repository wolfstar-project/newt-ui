"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/registry/bases/newt/ui/avatar"
import { Button } from "@/registry/bases/newt/ui/button"
import { Chat, ChatBody, ChatFooter } from "@/registry/bases/newt/ui/chat"
import { Markdown } from "@/registry/bases/newt/ui/markdown"
import { MessageComposer } from "@/registry/bases/newt/ui/message-composer"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "@/registry/bases/newt/ui/message-group"
import { MessageList } from "@/registry/bases/newt/ui/message-list"
import { TypingIndicator } from "@/registry/bases/newt/ui/typing-indicator"

/*
 * A conversation with an assistant: who you are talking to, the exchange so
 * far, and the composer. Before the first message the list gives way to a
 * greeting and a few prompts to start from; while a reply is on its way the
 * assistant is shown typing.
 *
 * The block knows nothing about a model or a transport. It draws `messages`
 * and reports what was sent; calling the model, streaming the reply into the
 * array and setting `pending` are the application's.
 */
export interface AiChatMessage {
  id: string
  role: "user" | "assistant"
  /** An assistant's body is rendered as chat markdown; a user's as written. */
  body: string
  sentAt: string
  /** Rendered timestamp; the ISO value goes in `sentAt`. */
  displayTime: string
}

export interface AiChatProps extends React.ComponentProps<"div"> {
  assistantName: string
  /** Said quietly beside the name: the model, or what the assistant is for. */
  caption?: string
  userName?: string
  messages: readonly AiChatMessage[]
  /** A reply is being written: the assistant is shown typing. */
  pending?: boolean
  /** The line above the prompts, before the first message. */
  greeting?: string
  /** Prompts offered before the first message; choosing one sends it. */
  suggestions?: readonly string[]
  onSend?: (message: string) => void
  /**
   * Called when the composer's add button is pressed. The composer always
   * draws that button, so without this it does nothing: open your own picker.
   */
  onAttach?: () => void
}

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

export function AiChat({
  assistantName,
  caption,
  userName = "You",
  messages,
  pending = false,
  greeting = "How can I help?",
  suggestions = [],
  onSend,
  onAttach,
  className,
  ...props
}: AiChatProps) {
  const [value, setValue] = React.useState("")
  const empty = messages.length === 0 && !pending

  /*
   * New text is followed while the reader is at the bottom and left alone once
   * they have scrolled up to read something older. Sending always follows.
   */
  const body = React.useRef<HTMLDivElement>(null)
  const following = React.useRef(true)
  React.useEffect(() => {
    const element = body.current
    if (following.current && element) element.scrollTop = element.scrollHeight
  }, [messages, pending])

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-newt-border bg-newt-bg-elevated",
        className
      )}
      {...props}
    >
      <header className="flex items-center gap-3 border-b border-newt-border px-4 py-3">
        <Avatar>{initial(assistantName)}</Avatar>
        <div className="flex min-w-0 flex-col">
          <span className="flex items-center gap-1.5 font-display text-[15px] font-semibold text-newt-text-primary">
            {assistantName}
            <MessageGroupBotTag aria-label="AI assistant">
              AI
            </MessageGroupBotTag>
          </span>
          {caption && (
            <span className="truncate text-xs text-newt-text-muted">
              {caption}
            </span>
          )}
        </div>
      </header>

      <Chat aria-label={`Conversation with ${assistantName}`} className="h-96">
        <ChatBody
          ref={body}
          focusable
          viewportLabel={`Messages with ${assistantName}`}
          onScroll={(event) => {
            const { scrollHeight, scrollTop, clientHeight } =
              event.currentTarget
            following.current = scrollHeight - scrollTop - clientHeight < 48
          }}
        >
          {empty ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center">
              <p className="font-display text-xl font-semibold text-newt-text-primary">
                {greeting}
              </p>
              {suggestions.length > 0 && (
                <div className="flex max-w-md flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="secondary"
                      size="sm"
                      className="border border-newt-border"
                      onClick={() => onSend?.(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <MessageList label={`Messages with ${assistantName}`}>
              {messages.map((message) => {
                const fromAssistant = message.role === "assistant"
                const author = fromAssistant ? assistantName : userName
                return (
                  <MessageGroup key={message.id}>
                    <MessageGroupAvatar>
                      <Avatar>{initial(author)}</Avatar>
                    </MessageGroupAvatar>
                    <MessageGroupBody>
                      <MessageGroupHeader>
                        <MessageGroupAuthor>{author}</MessageGroupAuthor>
                        {fromAssistant && (
                          <MessageGroupBotTag aria-label="AI assistant">
                            AI
                          </MessageGroupBotTag>
                        )}
                        <MessageGroupTime dateTime={message.sentAt}>
                          {message.displayTime}
                        </MessageGroupTime>
                      </MessageGroupHeader>
                      <MessageGroupContent>
                        {fromAssistant ? (
                          <Markdown content={message.body} />
                        ) : (
                          <span className="whitespace-pre-wrap">
                            {message.body}
                          </span>
                        )}
                      </MessageGroupContent>
                    </MessageGroupBody>
                  </MessageGroup>
                )
              })}
            </MessageList>
          )}
        </ChatBody>
        <ChatFooter>
          {/*
           * The status region is always there, so that its text appearing is
           * what a screen reader announces; mounted together with its text, a
           * live region is often missed.
           */}
          <div role="status" className="flex h-6 items-center px-1">
            {pending && (
              <TypingIndicator role="none" aria-label={undefined}>
                {assistantName} is writing…
              </TypingIndicator>
            )}
          </div>
          <MessageComposer
            channelName={assistantName}
            aria-label={`Message ${assistantName}`}
            onAdd={onAttach}
            placeholder={`Ask ${assistantName} anything`}
            value={value}
            onValueChange={setValue}
            onSubmit={(message) => {
              following.current = true
              onSend?.(message)
              setValue("")
            }}
          />
        </ChatFooter>
      </Chat>
    </div>
  )
}
