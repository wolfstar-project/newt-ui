<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { scrollbarClassName } from "~~/registry/bases/newt/ui/scrollbar"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="listbox"
    :class="
      cn('min-w-0 flex-1 overflow-y-auto p-2', scrollbarClassName, props.class)
    "
  >
    <slot />
  </div>
</template>
