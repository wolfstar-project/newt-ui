<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Renders the icons in the dnd color to signal a muted / deafened member. */
  muted?: boolean
}>()
</script>

<template>
  <div
    :data-muted="props.muted ? '' : undefined"
    :class="
      cn(
        'ml-auto flex items-center gap-1 text-xs text-newt-text-muted',
        props.muted && 'text-newt-dnd',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
