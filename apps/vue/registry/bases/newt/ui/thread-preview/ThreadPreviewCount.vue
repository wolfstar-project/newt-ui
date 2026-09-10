<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** How many messages the thread holds. */
  count: number
}>()
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
    {{ props.count === 1 ? "1 message" : `${props.count} messages` }}
  </span>
</template>
