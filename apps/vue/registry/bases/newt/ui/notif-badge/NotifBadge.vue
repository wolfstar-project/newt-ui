<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { notifBadgeVariants, type NotifBadgeVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: NotifBadgeVariants["variant"]
}>()
</script>

<template>
  <span
    :class="cn(notifBadgeVariants({ variant: props.variant }), props.class)"
  >
    <slot />
  </span>
</template>
