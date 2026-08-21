<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { type TimelineDotVariants, timelineDotVariants } from "."

const props = defineProps<{
  variant?: TimelineDotVariants["variant"]
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    aria-hidden="true"
    :class="cn(timelineDotVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </div>
</template>
