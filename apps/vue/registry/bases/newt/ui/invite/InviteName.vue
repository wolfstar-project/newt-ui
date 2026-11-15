<script setup lang="ts">
import type { Component, HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * The element or component to render. Defaults to `a`; pass `NuxtLink`
     * or `RouterLink` to keep client navigation.
     */
    as?: string | Component
  }>(),
  { as: "a" }
)
</script>

<template>
  <component
    :is="props.as"
    :class="
      cn(
        'block truncate font-bold text-newt-text-primary no-underline hover:underline',
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
