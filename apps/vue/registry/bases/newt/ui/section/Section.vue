<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * A block of text with one thing beside it: a thumbnail, or a button. That
 * pairing is the whole component — the text column takes the space that is
 * left, and the accessory keeps its own width whatever the text does.
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div :class="cn('flex w-full items-start gap-4', props.class)">
    <slot />
  </div>
</template>
