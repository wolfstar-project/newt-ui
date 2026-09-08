<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!-- The channel shell: a scrolling message log with the composer pinned below. -->
<template>
  <section
    :class="
      cn(
        'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-newt-bg-elevated',
        props.class
      )
    "
  >
    <slot />
  </section>
</template>
