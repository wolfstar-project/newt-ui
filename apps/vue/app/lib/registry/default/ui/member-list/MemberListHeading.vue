<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <h3
    :class="
      cn(
        'm-0 px-2 pb-0.5 text-[12px] font-semibold uppercase leading-4 tracking-[0.02em] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </h3>
</template>
