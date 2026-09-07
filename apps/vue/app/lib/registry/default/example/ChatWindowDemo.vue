<script setup lang="ts">
import { ChatWindow } from "@/lib/registry/default/block/chat-window"

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
]
</script>

<template>
  <ChatWindow
    class="w-full max-w-lg"
    channel-name="general"
    topic="Say hello and tell us what you are building."
    :messages="MESSAGES"
  />
</template>
