<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes["class"]; src: string; alt?: string }>(),
  { alt: "" }
)
</script>

<template>
  <img
    :src="props.src"
    :alt="props.alt"
    :aria-hidden="props.alt === '' ? true : undefined"
    :class="
      cn(
        'h-20 w-20 shrink-0 rounded-lg bg-newt-bg-base object-cover',
        props.class
      )
    "
  />
</template>
