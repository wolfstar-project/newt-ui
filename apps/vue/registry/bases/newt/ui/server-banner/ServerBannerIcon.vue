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
        'flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--newt-radius-lg)] bg-newt-brand text-[22px] font-bold text-newt-on-accent',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
