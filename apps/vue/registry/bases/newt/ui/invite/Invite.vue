<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'max-w-[432px] rounded-md bg-newt-bg-surface px-4 pb-4 pt-2 text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
