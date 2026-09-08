<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col items-center gap-2 px-5 py-10 text-center text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
