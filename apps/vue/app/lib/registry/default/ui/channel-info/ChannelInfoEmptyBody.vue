<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <p :class="cn('max-w-[36ch] text-sm text-newt-text-muted', props.class)">
    <slot />
  </p>
</template>
