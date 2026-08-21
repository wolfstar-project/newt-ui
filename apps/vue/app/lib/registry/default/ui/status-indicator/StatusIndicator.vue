<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div role="status" :class="cn('relative inline-block', props.class)">
    <slot />
  </div>
</template>
