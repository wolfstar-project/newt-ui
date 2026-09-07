<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    aria-hidden="true"
    :class="
      cn(
        'flex h-14 w-14 items-center justify-center rounded-full bg-newt-bg-elevated text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
