<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!-- The command chip shown when the reply is a slash-command interaction. -->
<template>
  <span
    :class="
      cn(
        'inline-flex min-w-0 items-center gap-0.5 rounded-sm bg-[color-mix(in_srgb,var(--newt-brand)_15%,transparent)] px-1 font-medium text-newt-mention-text',
        props.class
      )
    "
  >
    <span class="truncate"><slot /></span>
  </span>
</template>
