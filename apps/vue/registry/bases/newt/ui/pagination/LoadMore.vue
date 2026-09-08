<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    :class="
      cn(
        'flex items-center justify-center gap-2.5 p-3 text-[13px] text-newt-text-muted before:h-px before:flex-1 before:bg-newt-border before:content-[\'\'] after:h-px after:flex-1 after:bg-newt-border after:content-[\'\']',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
