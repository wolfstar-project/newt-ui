<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Bots use circular avatars; games and activities keep the squircle. */
    round?: boolean
  }>(),
  { round: false }
)
</script>

<template>
  <span
    aria-hidden="true"
    :class="
      cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden bg-newt-bg-base text-newt-text-secondary',
        props.round ? 'rounded-full' : 'rounded-[10px]',
        '[&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>svg]:h-5 [&>svg]:w-5',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
