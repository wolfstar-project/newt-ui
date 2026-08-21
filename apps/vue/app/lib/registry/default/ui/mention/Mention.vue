<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { mentionVariants, type MentionVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: MentionVariants["variant"]
}>()
</script>

<template>
  <span
    :data-variant="props.variant ?? 'user'"
    :class="cn(mentionVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </span>
</template>
