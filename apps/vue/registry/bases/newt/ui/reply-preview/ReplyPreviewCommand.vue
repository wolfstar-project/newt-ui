<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!--
  The command chip shown when the reply is a slash-command interaction. The
  `icon` slot sits outside the truncating label, so the gap of the chip
  applies and the icon never clips.
-->
<template>
  <span
    :class="
      cn(
        'inline-flex min-w-0 items-center gap-0.5 rounded-[var(--newt-radius-sm)] bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] px-1 font-medium text-newt-mention-text [&>svg]:h-3 [&>svg]:w-3 [&>svg]:shrink-0',
        props.class
      )
    "
  >
    <slot name="icon" />
    <span class="truncate"><slot /></span>
  </span>
</template>
