<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <header
    :class="
      cn(
        'flex h-12 items-center justify-between gap-3 border-b border-newt-border bg-newt-bg-surface ps-4 pe-3 text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </header>
</template>
