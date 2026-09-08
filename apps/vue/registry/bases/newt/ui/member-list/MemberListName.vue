<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Render the name in the brand colour. */
  colored?: boolean
  /** Role colour. Any CSS colour; wins over `colored`. */
  color?: string
}>()

/*
 * SAFETY: `CSSProperties` has no index signature for custom properties, but
 * Vue writes unknown `--*` keys to the style attribute verbatim, so the extra
 * key lands exactly as spelled here.
 */
const style = computed<CSSProperties | undefined>(() =>
  props.color
    ? ({ "--newt-member-name-color": props.color } as CSSProperties)
    : undefined
)

const colorClass = computed(() => {
  if (props.color) return "text-[var(--newt-member-name-color)]"
  return props.colored ? "text-newt-brand" : "text-newt-text-primary"
})
</script>

<template>
  <span
    data-slot="member-name"
    :style="style"
    :class="cn('truncate text-sm font-medium', colorClass, props.class)"
  >
    <slot />
  </span>
</template>
