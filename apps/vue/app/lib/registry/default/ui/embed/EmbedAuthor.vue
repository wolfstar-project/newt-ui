<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex min-w-0 items-center gap-2 text-[14px] font-semibold text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
