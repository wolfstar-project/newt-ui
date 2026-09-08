<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Green dot for the online count, muted for the member total. */
    online?: boolean
  }>(),
  { online: false }
)
</script>

<template>
  <span :class="cn('inline-flex items-center gap-1.5', props.class)">
    <span
      aria-hidden="true"
      :class="
        cn(
          'h-2 w-2 shrink-0 rounded-full',
          props.online ? 'bg-newt-online' : 'bg-newt-offline'
        )
      "
    />
    <slot />
  </span>
</template>
