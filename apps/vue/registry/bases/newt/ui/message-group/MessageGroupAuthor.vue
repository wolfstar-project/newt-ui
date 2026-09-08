<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    :class="cn('text-[15px] font-semibold text-newt-text-primary', props.class)"
  >
    <slot />
  </span>
</template>
