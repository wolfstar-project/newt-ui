<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  selected?: boolean
}>()
</script>

<template>
  <div
    role="option"
    :aria-selected="props.selected ?? false"
    :data-state="props.selected ? 'selected' : 'unselected'"
    :class="
      cn(
        'flex cursor-pointer items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm text-newt-text-secondary hover:bg-newt-brand hover:text-white',
        props.selected &&
          'text-newt-text-primary after:ml-auto after:font-bold after:text-newt-brand after:content-[\'\\2713\'] hover:after:text-white',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
