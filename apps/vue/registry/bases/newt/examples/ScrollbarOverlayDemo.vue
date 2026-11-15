<script setup lang="ts">
import { ScrollArea } from "~~/registry/bases/newt/ui/scrollbar"

const channels = [
  "welcome",
  "rules",
  "announcements",
  "general",
  "introductions",
  "help",
  "showcase",
  "feedback",
  "off-topic",
  "music",
  "art",
  "events",
  "suggestions",
  "dev-log",
  "releases",
  "lounge",
]
</script>

<template>
  <!--
    A column with a card floating over its foot. The thumb is drawn over the
    rows, so they keep the full width, and the track stops above the card.
  -->
  <div class="relative w-full max-w-[240px]">
    <ScrollArea
      variant="overlay"
      focusable
      viewport-label="Channels"
      class="h-[240px] rounded-md bg-newt-bg-surface [--newt-scrollbar-inset-end:60px]"
      viewport-class="p-2 pb-[60px]"
    >
      <ul class="flex flex-col gap-0.5 text-[14px] text-newt-text-secondary">
        <li
          v-for="channel in channels"
          :key="channel"
          class="rounded-sm px-2 py-1.5 hover:bg-newt-bg-hover"
        >
          # {{ channel }}
        </li>
      </ul>
    </ScrollArea>
    <p
      class="absolute inset-x-2 bottom-2 rounded-md bg-newt-bg-floating px-3 py-2.5 text-[13px] font-medium text-newt-text-primary shadow-elevation-low"
    >
      Riley is online
    </p>
  </div>
</template>
