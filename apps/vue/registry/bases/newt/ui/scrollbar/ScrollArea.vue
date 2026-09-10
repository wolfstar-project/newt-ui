<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { scrollbarClassName } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * Put the viewport in the tab order so it can be scrolled from the keyboard
     * (WCAG 2.1.1). Off by default: a focusable region only helps when the area
     * actually scrolls and holds no other focusable content.
     */
    focusable?: boolean
    /** Accessible name of the focusable viewport. */
    viewportLabel?: string
  }>(),
  { viewportLabel: "Scrollable region" }
)
</script>

<template>
  <div
    :tabindex="props.focusable ? 0 : undefined"
    :role="props.focusable ? 'group' : undefined"
    :aria-label="props.focusable ? props.viewportLabel : undefined"
    :class="cn('overflow-auto', scrollbarClassName, props.class)"
  >
    <slot />
  </div>
</template>
