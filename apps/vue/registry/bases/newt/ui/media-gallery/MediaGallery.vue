<script setup lang="ts">
import { computed, useSlots, type HTMLAttributes, type VNode } from "vue"

import { cn } from "@/lib/utils"

import { mediaGalleryLayout } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /**
   * How many items the grid holds. Counted from the slot when it is not
   * given, which is what a static list wants.
   */
  count?: number
}>()

const slots = useSlots()

const items = computed(() => {
  if (props.count !== undefined) return props.count
  const nodes: VNode[] = slots.default?.() ?? []
  /* A `v-for` arrives as one fragment, so its children are the real count. */
  return nodes.reduce(
    (total, node) =>
      total + (Array.isArray(node.children) ? node.children.length : 1),
    0
  )
})
</script>

<template>
  <div
    :class="
      cn(
        'grid max-w-[550px] auto-rows-[1fr] gap-1 overflow-hidden rounded-lg',
        mediaGalleryLayout(items),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
