<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/** One numbered line under an entry. Wrap the value that changed in `<strong>`. */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <li
    :class="
      cn(
        'marker:font-mono marker:text-xs marker:text-newt-text-muted [&_strong]:font-semibold [&_strong]:text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </li>
</template>
