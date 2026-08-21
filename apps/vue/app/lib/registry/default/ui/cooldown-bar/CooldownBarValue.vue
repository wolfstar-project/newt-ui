<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <strong
    :class="cn('font-mono font-semibold text-newt-text-secondary', props.class)"
  >
    <slot />
  </strong>
</template>
