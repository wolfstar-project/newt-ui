<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The accessory never shrinks and never stretches: it is the fixed side of
 * the pair, which is what keeps a long paragraph from squeezing a thumbnail
 * into a sliver.
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div :class="cn('flex shrink-0 items-start', props.class)">
    <slot />
  </div>
</template>
