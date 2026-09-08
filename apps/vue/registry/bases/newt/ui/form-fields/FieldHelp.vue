<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * `error` colours the text and announces it: a validation message that appears
 * after a submit is useless to a reader who never sees it.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    variant?: "help" | "error"
  }>(),
  { variant: "help" }
)
</script>

<template>
  <span
    :role="props.variant === 'error' ? 'alert' : undefined"
    :class="
      cn(
        'text-xs',
        props.variant === 'error' ? 'text-newt-danger' : 'text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
