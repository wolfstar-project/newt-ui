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
        'relative flex max-w-[var(--newt-embed-max-width)] overflow-hidden rounded-md border border-s-0 border-newt-embed-border bg-newt-embed-bg before:absolute before:inset-y-0 before:start-0 before:w-1 before:bg-[var(--newt-embed-color,var(--newt-brand))] before:content-['']',
        props.class
      )
    "
  >
    <div class="flex min-w-0 flex-1 flex-col gap-2 py-3 ps-5 pe-4">
      <slot />
    </div>
  </div>
</template>
