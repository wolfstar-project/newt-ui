<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { defaultThreadPreviewCount } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** How many messages the thread holds. */
    count: number
    /** Builds the text from the count. Defaults to `1 message`, `3 messages`. */
    formatCount?: (count: number) => string
  }>(),
  { formatCount: defaultThreadPreviewCount }
)
</script>

<template>
  <!-- Spelled out rather than a bare number, which would read as an index. -->
  <span
    :class="
      cn(
        'shrink-0 text-xs font-medium tabular-nums text-newt-text-muted',
        props.class
      )
    "
  >
    {{ props.formatCount(props.count) }}
  </span>
</template>
