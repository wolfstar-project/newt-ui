<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Fill percentage, 0-100. */
  value: number
  /** Switch the fill to the "ready" (online green) colour. */
  ready?: boolean
}>()

const clamped = computed(() => Math.min(100, Math.max(0, props.value)))
</script>

<template>
  <div
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="clamped"
    :data-state="props.ready ? 'ready' : 'cooling'"
    :class="
      cn('h-1.5 overflow-hidden rounded-full bg-newt-bg-base', props.class)
    "
  >
    <div
      :class="
        cn(
          'h-full rounded-full',
          props.ready ? 'bg-newt-online' : 'bg-newt-idle'
        )
      "
      :style="{ width: `${clamped}%` }"
    />
  </div>
</template>
