<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div :class="cn('flex min-w-0 items-center gap-3 px-4 pb-3', props.class)">
    <slot />
  </div>
</template>
