<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import TypingIndicatorDots from "./TypingIndicatorDots.vue"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Accessible label announced to screen readers. */
    label?: string
  }>(),
  { label: "Someone is typing" }
)
</script>

<template>
  <div
    role="status"
    :aria-label="label"
    :class="
      cn(
        'inline-flex items-center gap-2 text-[13px] text-newt-text-muted',
        props.class
      )
    "
  >
    <TypingIndicatorDots />
    <slot />
  </div>
</template>
