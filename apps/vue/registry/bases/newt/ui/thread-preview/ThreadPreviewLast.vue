<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/** The last thing said in the thread, which is why anyone opens it. */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    :class="cn('min-w-0 flex-1 truncate text-newt-text-muted', props.class)"
  >
    <slot />
  </span>
</template>
