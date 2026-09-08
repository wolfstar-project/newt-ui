<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <kbd
    :class="
      cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-newt-border bg-newt-bg-base px-1.5 font-mono text-[11px] font-semibold text-newt-text-secondary shadow-[0_1px_0_var(--newt-border)]',
        props.class
      )
    "
  >
    <slot />
  </kbd>
</template>
