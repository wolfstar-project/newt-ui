<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn('mb-0.5 text-[13px] font-semibold text-newt-text-primary', props.class)
    "
  >
    <slot />
  </div>
</template>
