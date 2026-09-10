<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span :class="cn('shrink-0 font-medium text-newt-text-link', props.class)">
    <slot />
  </span>
</template>
