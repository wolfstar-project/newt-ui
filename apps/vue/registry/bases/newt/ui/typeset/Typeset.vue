<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { typesetVariants, type TypesetVariants } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    preset?: TypesetVariants["preset"]
    measure?: boolean
    /** Render as `<article>` or any other element that suits the content. */
    as?: "div" | "article" | "section"
  }>(),
  { as: "div" }
)
</script>

<template>
  <component
    :is="props.as"
    :class="
      cn(
        typesetVariants({ preset: props.preset, measure: props.measure }),
        props.class
      )
    "
  >
    <slot />
  </component>
</template>
