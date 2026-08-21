<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="separator"
    :class="
      cn(
        'my-4 flex items-center gap-3 text-xs font-semibold text-newt-text-muted',
        'before:h-px before:flex-1 before:bg-newt-border before:content-[\'\']',
        'after:h-px after:flex-1 after:bg-newt-border after:content-[\'\']',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
