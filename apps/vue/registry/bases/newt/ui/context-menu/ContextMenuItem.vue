<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { contextMenuItemVariants, type ContextMenuItemVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  variant?: ContextMenuItemVariants["variant"]
}>()
</script>

<template>
  <div
    role="menuitem"
    tabindex="-1"
    :class="
      cn(contextMenuItemVariants({ variant: props.variant }), props.class)
    "
  >
    <slot />
  </div>
</template>
