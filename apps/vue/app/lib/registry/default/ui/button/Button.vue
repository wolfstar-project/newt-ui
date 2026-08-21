<script setup lang="ts">
import type { ButtonHTMLAttributes, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { type ButtonVariants, buttonVariants } from "."

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants["variant"]
    size?: ButtonVariants["size"]
    type?: ButtonHTMLAttributes["type"]
    disabled?: boolean
    class?: HTMLAttributes["class"]
  }>(),
  { type: "button" }
)
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled"
    :class="
      cn(
        buttonVariants({ variant: props.variant, size: props.size }),
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
