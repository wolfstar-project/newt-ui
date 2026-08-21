<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex max-w-[360px] items-center gap-3 rounded-md border border-newt-border bg-newt-bg-surface px-3 py-[10px]',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
