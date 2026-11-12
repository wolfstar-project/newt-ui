<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue"
import {
  AiChat,
  type AiChatMessage,
} from "~~/registry/bases/newt/blocks/ai-chat"

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

const messages = ref<AiChatMessage[]>([])
const pending = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

onBeforeUnmount(() => clearTimeout(timer))

function send(body: string) {
  messages.value.push({
    id: `user-${messages.value.length}`,
    role: "user",
    body,
    sentAt: SENT_AT,
    displayTime: DISPLAY_TIME,
  })
  pending.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    messages.value.push({
      id: `assistant-${messages.value.length}`,
      role: "assistant",
      body: REPLY,
      sentAt: SENT_AT,
      displayTime: DISPLAY_TIME,
    })
    pending.value = false
  }, 1200)
}
</script>

<template>
  <AiChat
    class="w-full max-w-lg"
    assistant-name="Newt"
    caption="Answers from your own model"
    :messages="messages"
    :pending="pending"
    :suggestions="SUGGESTIONS"
    @send="send"
  />
</template>
