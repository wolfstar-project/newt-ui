<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span :class="cn('max-w-[360px] truncate text-newt-text-muted', props.class)">
    <slot />
  </span>
</template>
