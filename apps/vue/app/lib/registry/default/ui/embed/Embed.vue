<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex max-w-[520px] overflow-hidden rounded-md border-l-4 border-newt-brand bg-newt-bg-elevated',
        props.class
      )
    "
  >
    <div class="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3">
      <slot />
    </div>
  </div>
</template>
