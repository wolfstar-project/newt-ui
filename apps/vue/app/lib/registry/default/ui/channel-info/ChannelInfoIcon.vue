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
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-newt-bg-elevated text-lg font-bold leading-none text-newt-text-muted',
        props.class
      )
    "
  >
    <slot>#</slot>
  </div>
</template>
