<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** Link to the app's page. Without it the name renders as plain text. */
  href?: string
}>()
</script>

<template>
  <component
    :is="props.href === undefined ? 'span' : 'a'"
    :href="props.href"
    :class="
      cn(
        'block truncate text-base font-bold text-newt-text-primary no-underline',
        props.href !== undefined && 'hover:underline',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
