<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Accent colour of the left bar. Any CSS colour; defaults to the brand. */
  color?: string
}>()

/*
 * SAFETY: `CSSProperties` has no index signature for custom properties, but
 * Vue writes unknown `--*` keys to the style attribute verbatim, so the extra
 * key lands exactly as spelled here.
 */
const style = computed<CSSProperties | undefined>(() =>
  props.color
    ? ({ "--newt-embed-color": props.color } as CSSProperties)
    : undefined
)
</script>

<template>
  <div
    :style="style"
    :class="
      cn(
        'flex max-w-[var(--newt-embed-max-width)] overflow-hidden rounded-md border-l-4 border-[var(--newt-embed-color,var(--newt-brand))] bg-newt-bg-elevated',
        props.class
      )
    "
  >
    <div class="flex min-w-0 flex-1 flex-col gap-2 px-4 py-3">
      <slot />
    </div>
  </div>
</template>
