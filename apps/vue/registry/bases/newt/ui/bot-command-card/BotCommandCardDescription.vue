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
        'mb-3 text-[13px] leading-normal text-newt-text-secondary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
