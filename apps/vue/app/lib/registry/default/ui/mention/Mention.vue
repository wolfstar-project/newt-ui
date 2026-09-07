<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

import { mentionVariants, type MentionVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: MentionVariants["variant"]
  /** Avatar URL. Rendered from 48rem up; below that the chip stays text-only. */
  avatar?: string
  /** Role colour, for `variant="role"`. Any CSS colour. */
  color?: string
}>()

/*
 * SAFETY: `CSSProperties` has no index signature for custom properties, but
 * Vue writes unknown `--*` keys to the style attribute verbatim, so the extra
 * key lands exactly as spelled here.
 */
const style = computed<CSSProperties | undefined>(() =>
  props.color
    ? ({ "--newt-mention-color": props.color } as CSSProperties)
    : undefined
)
</script>

<template>
  <button
    type="button"
    :data-variant="props.variant ?? 'user'"
    :style="style"
    :class="
      cn(
        mentionVariants({ variant: props.variant }),
        props.avatar && 'pl-0.5',
        props.class
      )
    "
  >
    <img
      v-if="props.avatar"
      :src="props.avatar"
      alt=""
      aria-hidden="true"
      class="hidden h-5 w-5 shrink-0 rounded-full object-cover md:block"
    />
    <slot />
  </button>
</template>
