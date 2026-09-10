<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn('shrink-0 font-bold text-newt-text-muted', props.class)"
  >
    <slot>#</slot>
  </span>
</template>
