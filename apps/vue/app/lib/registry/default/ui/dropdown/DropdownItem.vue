<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Highlights the item as if hovered (e.g. keyboard focus / selected). */
  active?: boolean
}>()
</script>

<template>
  <div
    role="menuitem"
    tabindex="-1"
    :data-active="props.active ? '' : undefined"
    :class="
      cn(
        'group flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 transition-colors duration-fast ease-newt hover:bg-newt-brand data-[active]:bg-newt-brand',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
