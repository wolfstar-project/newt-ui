<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The elbow that ties the card back to the message above it. Decorative: the
 * relationship is already in the markup.
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="
      cn(
        'block h-3 w-4 shrink-0 rounded-ss-[8px] border-s-2 border-t-2 border-newt-border',
        props.class
      )
    "
  />
</template>
