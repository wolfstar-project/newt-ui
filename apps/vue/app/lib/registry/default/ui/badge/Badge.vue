<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { badgeVariants, type BadgeVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: BadgeVariants["variant"]
  dot?: boolean
}>()
</script>

<template>
  <span
    :class="
      cn(badgeVariants({ variant: props.variant, dot: props.dot }), props.class)
    "
  >
    <slot />
  </span>
</template>
