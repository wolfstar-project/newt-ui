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
        'max-w-[480px] rounded-md border border-newt-border bg-newt-bg-elevated p-4',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
