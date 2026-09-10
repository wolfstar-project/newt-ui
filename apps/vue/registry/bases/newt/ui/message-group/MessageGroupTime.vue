<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Machine-readable timestamp for the `datetime` attribute. */
  datetime?: string
}>()
</script>

<!-- A real `<time>`: the timestamp is machine-readable, not just small text. -->
<template>
  <time
    :datetime="props.datetime"
    :class="cn('text-[11px] text-newt-text-muted', props.class)"
  >
    <slot />
  </time>
</template>
