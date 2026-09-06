<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Sticky section header, as used by the "Frequently Used" block. -->
  <p
    role="presentation"
    :class="
      cn(
        'sticky top-0 z-[1] m-0 flex items-center gap-1.5 bg-newt-bg-floating px-2 py-1.5 text-sm font-semibold text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </p>
</template>
