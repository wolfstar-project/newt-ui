<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div :class="cn('flex gap-4 py-1 hover:bg-black/[0.06]', props.class)">
    <slot />
  </div>
</template>
