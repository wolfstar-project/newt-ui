<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex max-w-[480px] items-center gap-4 rounded-lg border border-newt-border bg-newt-bg-elevated px-5 py-4',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
