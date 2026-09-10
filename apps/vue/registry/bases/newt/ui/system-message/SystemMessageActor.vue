<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/** The name inside a system line, bolder than the sentence it sits in. */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span :class="cn('font-medium text-newt-text-primary', props.class)">
    <slot />
  </span>
</template>
