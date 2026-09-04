<script setup lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    type?: ButtonHTMLAttributes["type"]
  }>(),
  { type: "button" }
)
</script>

<template>
  <button
    :type="props.type"
    :class="
      cn(
        'cursor-pointer border-0 bg-transparent p-0 font-[inherit] text-newt-text-link hover:underline',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
