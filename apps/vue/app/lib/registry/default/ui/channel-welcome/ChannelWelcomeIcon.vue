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
        'mb-4 flex h-[68px] w-[68px] items-center justify-center rounded-full bg-newt-bg-elevated text-[32px] font-bold leading-none text-newt-text-primary',
        props.class
      )
    "
  >
    <slot>#</slot>
  </div>
</template>
