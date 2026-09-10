<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Round dot that sets the topic apart from the channel name. -->
  <span
    aria-hidden="true"
    :class="
      cn(
        'h-1 w-1 shrink-0 rounded-full bg-newt-text-muted opacity-70',
        props.class
      )
    "
  />
</template>
