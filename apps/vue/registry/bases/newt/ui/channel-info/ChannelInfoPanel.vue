<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Scrolling area under the tab strip. -->
  <div :class="cn('min-h-0 flex-1 overflow-y-auto px-2 pb-4', props.class)">
    <slot />
  </div>
</template>
