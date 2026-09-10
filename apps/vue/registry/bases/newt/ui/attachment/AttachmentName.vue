<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="cn('truncate text-sm font-medium text-newt-text-link', props.class)"
  >
    <slot />
  </div>
</template>
