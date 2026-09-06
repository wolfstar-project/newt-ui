<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Grip shown when the launcher is presented as a bottom sheet. -->
  <div
    aria-hidden="true"
    :class="
      cn(
        'mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-newt-border',
        props.class
      )
    "
  />
</template>
