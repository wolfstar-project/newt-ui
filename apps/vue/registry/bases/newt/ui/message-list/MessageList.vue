<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The log of grouped messages in a channel. `role="log"` with a polite live
 * region is what makes an arriving message announce itself without stealing
 * focus from whatever the reader is doing.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Accessible name, e.g. `Messages in #general`. */
  label?: string
}>()
</script>

<template>
  <div
    role="log"
    aria-live="polite"
    aria-relevant="additions text"
    :aria-label="props.label"
    :class="
      cn(
        'flex min-w-0 flex-col px-2 pb-4 pt-1 sm:px-4',
        // Rows sit flush: the list owns the padding, not the row. A descendant
        // selector, so a row inside a wrapper keeps its padding.
        '[&_[data-slot=message-row]]:rounded-[var(--newt-radius-sm)] [&_[data-slot=message-row]]:px-2 [&_[data-slot=message-row]]:py-1.5',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
