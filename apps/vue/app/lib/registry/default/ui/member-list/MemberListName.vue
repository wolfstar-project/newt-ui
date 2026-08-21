<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Render the name in the brand colour. */
  colored?: boolean
}>()
</script>

<template>
  <span
    :class="
      cn(
        'truncate text-sm font-medium',
        props.colored ? 'text-newt-brand' : 'text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
