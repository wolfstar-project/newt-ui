<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  /** Role colour applied to the tag; the dot inherits it via `currentColor`. */
  color?: string
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center gap-1 rounded-sm border border-newt-border bg-newt-bg-elevated px-1.5 py-0.5 text-[11px] font-semibold',
        props.class
      )
    "
    :style="props.color ? { color: props.color } : undefined"
  >
    <slot />
  </span>
</template>
