<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    :class="
      cn(
        'rounded-[3px] bg-newt-brand px-1 py-px text-[10px] font-semibold uppercase tracking-[0.02em] text-white',
        props.class
      )
    "
  >
    <slot>BOT</slot>
  </span>
</template>
