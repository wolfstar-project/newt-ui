<script setup lang="ts">
import type { CSSProperties, HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

import { mentionVariants, type MentionElement, type MentionVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: MentionVariants["variant"]
  /**
   * `button` (the default) for a mention that opens something in place, `a`
   * for one that navigates (pass `href`), `span` for a read-only mention that
   * is neither focusable nor clickable.
   */
  as?: MentionElement
  /** Link target, for `as="a"`. Passing it without `as` renders a link. */
  href?: string
  /** Avatar URL. Rendered from 48rem up; below that the chip stays text-only. */
  avatar?: string
  /** Role colour, for `variant="role"`. Any CSS colour. */
  color?: string
}>()

const tag = computed<MentionElement>(
  () => props.as ?? (props.href === undefined ? "button" : "a")
)

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
  <component
    :is="tag"
    :type="tag === 'button' ? 'button' : undefined"
    :href="tag === 'a' ? props.href : undefined"
    :data-variant="props.variant ?? 'user'"
    :style="style"
    :class="
      cn(
        mentionVariants({
          variant: props.variant,
          interactive: tag !== 'span',
        }),
        props.avatar && 'ps-0.5',
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
  </component>
</template>
