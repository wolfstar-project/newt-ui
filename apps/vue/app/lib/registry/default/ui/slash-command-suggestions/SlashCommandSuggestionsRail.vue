<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Vertical strip of app icons that filters the list by app. -->
  <nav
    :class="
      cn(
        'flex shrink-0 flex-col items-center gap-2 overflow-y-auto border-r border-newt-border bg-newt-bg-base p-2',
        props.class
      )
    "
  >
    <slot />
  </nav>
</template>
