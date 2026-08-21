<script setup lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { paginationButtonVariants } from "."

const props = withDefaults(
  defineProps<{
    active?: boolean
    disabled?: ButtonHTMLAttributes["disabled"]
    class?: HTMLAttributes["class"]
  }>(),
  { active: false }
)
</script>

<template>
  <button
    type="button"
    :disabled="props.disabled"
    :aria-current="props.active ? 'page' : undefined"
    :data-active="props.active ? '' : undefined"
    :class="cn(paginationButtonVariants({ active: props.active }), props.class)"
  >
    <slot />
  </button>
</template>
