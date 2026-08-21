<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    /** Render the muted leading slash. Defaults to true. */
    slash?: boolean
    class?: HTMLAttributes["class"]
  }>(),
  { slash: true }
)
</script>

<template>
  <span
    :class="
      cn(
        'inline-flex items-center gap-1 font-mono text-sm font-semibold text-newt-brand',
        props.class
      )
    "
  >
    <span v-if="props.slash" class="font-normal text-newt-text-muted">/</span>
    <slot />
  </span>
</template>
