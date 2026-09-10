<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Machine-readable date for the rendered `<time>` element. */
  dateTime?: string
}>()
</script>

<template>
  <!-- Creation date, centred between two hairlines. -->
  <div
    :class="
      cn(
        'mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-newt-text-muted',
        '[&>span]:h-px [&>span]:bg-newt-border',
        props.class
      )
    "
  >
    <span aria-hidden="true" />
    <time :datetime="props.dateTime"><slot /></time>
    <span aria-hidden="true" />
  </div>
</template>
