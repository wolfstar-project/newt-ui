<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { textDisplayVariants, type TextDisplayVariants } from "."

/*
 * A block of message text, the most common Components V2 part. Line breaks
 * in the text are kept (`white-space: pre-line`), so a string with `\n`
 * renders the way the message was written.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    size?: TextDisplayVariants["size"]
    /**
     * The element or component to render. Defaults to `div`; pass `h2` or
     * `h3` when a heading size is also a heading of the page.
     */
    as?: string | Component
  }>(),
  { as: "div" }
)
</script>

<template>
  <component
    :is="props.as"
    :class="cn(textDisplayVariants({ size: props.size }), props.class)"
  >
    <slot />
  </component>
</template>
