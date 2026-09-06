<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="listbox"
    :class="cn('min-w-0 flex-1 overflow-y-auto p-2', props.class)"
  >
    <slot />
  </div>
</template>
