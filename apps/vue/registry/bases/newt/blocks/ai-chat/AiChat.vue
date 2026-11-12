<script setup lang="ts">
import { computed, nextTick, ref, watch, type HTMLAttributes } from "vue"
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import { Button } from "~~/registry/bases/newt/ui/button"
import { Chat, ChatBody, ChatFooter } from "~~/registry/bases/newt/ui/chat"
import { Markdown } from "~~/registry/bases/newt/ui/markdown"
import { MessageComposer } from "~~/registry/bases/newt/ui/message-composer"
import {
  MessageGroup,
  MessageGroupAuthor,
  MessageGroupAvatar,
  MessageGroupBody,
  MessageGroupBotTag,
  MessageGroupContent,
  MessageGroupHeader,
  MessageGroupTime,
} from "~~/registry/bases/newt/ui/message-group"
import { MessageList } from "~~/registry/bases/newt/ui/message-list"
import { TypingIndicator } from "~~/registry/bases/newt/ui/typing-indicator"

import { cn } from "@/lib/utils"

import type { AiChatMessage } from "./types"

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
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
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
  }>(),
  {
    userName: "You",
    pending: false,
    greeting: "How can I help?",
    suggestions: () => [],
  }
)

/** `attach`: the composer's add button was pressed. It always draws that button, so listen for it to open your own picker. */
const emit = defineEmits<{ send: [message: string]; attach: [] }>()

const value = ref("")
const empty = computed(() => props.messages.length === 0 && !props.pending)

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

function authorOf(message: AiChatMessage): string {
  return message.role === "assistant" ? props.assistantName : props.userName
}

/*
 * New text is followed while the reader is at the bottom and left alone once
 * they have scrolled up to read something older. Sending always follows.
 */
const body = ref<InstanceType<typeof ChatBody> | null>(null)
let following = true

function onScroll(event: Event) {
  const element = event.currentTarget
  if (element instanceof HTMLElement) {
    following =
      element.scrollHeight - element.scrollTop - element.clientHeight < 48
  }
}

watch(
  () => [props.messages, props.pending],
  async () => {
    if (!following) return
    await nextTick()
    const element = body.value?.$el
    if (element instanceof HTMLElement) element.scrollTop = element.scrollHeight
  },
  { deep: true }
)

function submit(message: string) {
  following = true
  emit("send", message)
  value.value = ""
}
</script>

<template>
  <div
    :class="
      cn(
        'overflow-hidden rounded-lg border border-newt-border bg-newt-bg-elevated',
        props.class
      )
    "
  >
    <header
      class="flex items-center gap-3 border-b border-newt-border px-4 py-3"
    >
      <Avatar>{{ initial(props.assistantName) }}</Avatar>
      <div class="flex min-w-0 flex-col">
        <span
          class="flex items-center gap-1.5 font-display text-[15px] font-semibold text-newt-text-primary"
        >
          {{ props.assistantName }}
          <MessageGroupBotTag aria-label="AI assistant">AI</MessageGroupBotTag>
        </span>
        <span
          v-if="props.caption"
          class="truncate text-xs text-newt-text-muted"
        >
          {{ props.caption }}
        </span>
      </div>
    </header>

    <Chat :aria-label="`Conversation with ${props.assistantName}`" class="h-96">
      <ChatBody
        ref="body"
        focusable
        :viewport-label="`Messages with ${props.assistantName}`"
        @scroll="onScroll"
      >
        <div
          v-if="empty"
          class="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-8 text-center"
        >
          <p class="font-display text-xl font-semibold text-newt-text-primary">
            {{ props.greeting }}
          </p>
          <div
            v-if="props.suggestions.length > 0"
            class="flex max-w-md flex-wrap justify-center gap-2"
          >
            <Button
              v-for="suggestion in props.suggestions"
              :key="suggestion"
              variant="secondary"
              size="sm"
              class="border border-newt-border"
              @click="emit('send', suggestion)"
            >
              {{ suggestion }}
            </Button>
          </div>
        </div>
        <MessageList v-else :label="`Messages with ${props.assistantName}`">
          <MessageGroup v-for="message in props.messages" :key="message.id">
            <MessageGroupAvatar>
              <Avatar>{{ initial(authorOf(message)) }}</Avatar>
            </MessageGroupAvatar>
            <MessageGroupBody>
              <MessageGroupHeader>
                <MessageGroupAuthor>{{ authorOf(message) }}</MessageGroupAuthor>
                <MessageGroupBotTag
                  v-if="message.role === 'assistant'"
                  aria-label="AI assistant"
                >
                  AI
                </MessageGroupBotTag>
                <MessageGroupTime :datetime="message.sentAt">
                  {{ message.displayTime }}
                </MessageGroupTime>
              </MessageGroupHeader>
              <MessageGroupContent>
                <Markdown
                  v-if="message.role === 'assistant'"
                  :content="message.body"
                />
                <span v-else class="whitespace-pre-wrap">{{
                  message.body
                }}</span>
              </MessageGroupContent>
            </MessageGroupBody>
          </MessageGroup>
        </MessageList>
      </ChatBody>
      <ChatFooter>
        <!--
          The status region is always there, so that its text appearing is what
          a screen reader announces; mounted together with its text, a live
          region is often missed.
        -->
        <div role="status" class="flex h-6 items-center px-1">
          <TypingIndicator
            v-if="props.pending"
            role="none"
            :aria-label="undefined"
          >
            {{ props.assistantName }} is writing…
          </TypingIndicator>
        </div>
        <MessageComposer
          v-model="value"
          :channel-name="props.assistantName"
          :aria-label="`Message ${props.assistantName}`"
          :placeholder="`Ask ${props.assistantName} anything`"
          @submit="submit"
          @add="emit('attach')"
        />
      </ChatFooter>
    </Chat>
  </div>
</template>
