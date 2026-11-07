<script setup lang="ts">
import { shallowRef } from "vue"
import {
  ExpressionsPicker,
  type ExpressionItem,
} from "~~/registry/bases/newt/ui/expressions-picker"
const items: ExpressionItem[] = [
  {
    id: "smile",
    kind: "emoji",
    label: "Smile",
    value: "😀",
    keywords: ["happy"],
  },
  {
    id: "wave",
    kind: "emoji",
    label: "Wave",
    value: "👋",
    keywords: ["hello"],
  },
  {
    id: "heart",
    kind: "emoji",
    label: "Heart",
    value: "❤️",
  },
  {
    id: "party",
    kind: "emoji",
    label: "Celebrate",
    value: "🎉",
  },
  {
    id: "coffee",
    kind: "emoji",
    label: "Coffee",
    value: "☕",
  },
  {
    id: "moon",
    kind: "emoji",
    label: "Moon",
    value: "🌙",
    disabled: true,
  },
  {
    id: "hello-sticker",
    kind: "sticker",
    label: "Hello sticker",
    value: "hello-sticker",
  },
  {
    id: "celebrate-gif",
    kind: "gif",
    label: "Celebration GIF",
    value: "celebrate-gif",
  },
]
const selected = shallowRef<ExpressionItem | null>(null)
</script>
<template>
  <div class="grid gap-[var(--newt-space-3)]">
    <ExpressionsPicker :items="items" @select="selected = $event" />
    <p role="status" class="m-0 text-newt-text-secondary">
      {{
        selected
          ? `Selected: ${selected.label}`
          : "Choose an emoji, sticker, or GIF."
      }}
    </p>
  </div>
</template>
