<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <caption
    :class="
      cn(
        'caption-bottom border-t border-newt-border px-4 py-2.5 text-start text-xs text-newt-text-muted',
        props.class
      )
    "
  >
    <slot />
  </caption>
</template>
