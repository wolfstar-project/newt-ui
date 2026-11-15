<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The box that anchors the dot to the avatar. It has no role: a member list
 * draws one per row, and a live region per row would announce every change.
 * The state is spoken by the `label` of the dot.
 */
const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div :class="cn('relative inline-block', props.class)">
    <slot />
  </div>
</template>
