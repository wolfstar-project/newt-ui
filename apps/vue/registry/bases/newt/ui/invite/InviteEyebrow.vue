<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    :class="
      cn(
        'text-[12px] font-extrabold uppercase tracking-[0.02em] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </span>
</template>
