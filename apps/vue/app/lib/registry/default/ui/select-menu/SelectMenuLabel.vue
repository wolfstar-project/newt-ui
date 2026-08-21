<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'px-2.5 pb-0.5 pt-1 text-[11px] font-bold uppercase tracking-[0.06em] text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
