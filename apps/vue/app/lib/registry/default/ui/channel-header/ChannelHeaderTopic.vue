<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    :class="
      cn(
        'min-w-0 truncate text-[13px] font-medium text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
