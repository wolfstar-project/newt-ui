<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="listbox"
    :class="
      cn(
        'max-h-80 min-w-[200px] overflow-y-auto rounded-md border border-newt-border bg-newt-bg-floating p-1.5 shadow-elevation-high',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
