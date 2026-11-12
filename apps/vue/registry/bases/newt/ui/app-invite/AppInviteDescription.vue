<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <p
    :class="
      cn('mt-1 line-clamp-2 text-sm text-newt-text-secondary', props.class)
    "
  >
    <slot />
  </p>
</template>
