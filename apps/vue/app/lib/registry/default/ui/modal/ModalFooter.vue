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
        'flex justify-end gap-2 rounded-b-lg bg-newt-bg-surface p-4',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
