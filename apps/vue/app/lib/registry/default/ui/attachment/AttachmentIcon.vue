<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    aria-hidden="true"
    :class="
      cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-newt-brand font-mono text-xs font-bold text-white',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
