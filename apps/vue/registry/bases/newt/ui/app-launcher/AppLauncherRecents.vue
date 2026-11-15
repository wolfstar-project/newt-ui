<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!--
    Horizontal strip of recently used apps, as a list: a screen reader
    announces how many there are. Name it with `aria-label` or
    `aria-labelledby`. `list-style: none` drops the list role in Safari, so
    the role is set again.
  -->
  <ul
    role="list"
    :class="
      cn(
        'm-0 flex list-none gap-3 overflow-x-auto p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        props.class
      )
    "
  >
    <slot />
  </ul>
</template>
