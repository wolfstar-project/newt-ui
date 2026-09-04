<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/* The APP tag bots carry next to their name; `verified` adds Discord's check. */
const props = defineProps<{
  class?: HTMLAttributes["class"]
  verified?: boolean
}>()
</script>

<template>
  <span
    role="img"
    :aria-label="props.verified ? 'Verified application' : 'Application'"
    :class="
      cn(
        'inline-flex shrink-0 items-center gap-0.5 rounded-sm bg-newt-brand px-1 py-px text-[9px] font-bold leading-none text-white',
        props.class
      )
    "
  >
    <svg
      v-if="props.verified"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      class="h-2.5 w-2.5"
    >
      <path
        fill="currentColor"
        d="M9.55 17.6 4.4 12.45l1.4-1.4 3.75 3.75 8.65-8.65 1.4 1.4z"
      />
    </svg>
    <slot>APP</slot>
  </span>
</template>
