<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="listitem"
    :class="
      cn(
        'flex min-w-0 cursor-pointer items-center gap-2.5 rounded-sm px-2 py-1.5 transition-colors duration-fast ease-newt hover:bg-newt-bg-hover',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
