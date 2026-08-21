<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn('mt-0.5 text-[13px] text-[var(--newt-text-secondary)]', props.class)
    "
  >
    <slot />
  </div>
</template>
