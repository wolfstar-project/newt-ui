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
        'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-newt-brand text-[22px] font-bold text-white',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
