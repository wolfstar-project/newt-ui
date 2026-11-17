<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { scrollbarClassName } from "~~/registry/bases/newt/ui/scrollbar"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-4 pb-4',
        scrollbarClassName,
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
