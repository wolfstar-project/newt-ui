<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn('px-1 text-[13px] text-newt-text-muted', props.class)"
  >
    <slot>&hellip;</slot>
  </span>
</template>
