<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <a
    :class="
      cn(
        'block truncate font-bold text-newt-text-primary no-underline hover:underline',
        props.class
      )
    "
  >
    <slot />
  </a>
</template>
