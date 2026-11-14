<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    /**
     * The element to render. `div` by default, because a `header` outside
     * `main`, `article`, `aside`, `nav` or `section` is a second banner
     * landmark. Pass `header` when the bar sits inside one of those.
     */
    as?: string | Component
    class?: HTMLAttributes["class"]
  }>(),
  { as: "div" }
)
</script>

<template>
  <!-- The bar above the message list: channel name, topic, channel actions. -->
  <component
    :is="props.as"
    :class="
      cn(
        'flex min-h-12 items-center justify-between gap-3 border-b border-newt-border bg-newt-bg-surface ps-4 pe-3 text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
