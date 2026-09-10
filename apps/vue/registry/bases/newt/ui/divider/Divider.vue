<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { dividerVariants, type DividerVariants } from "."

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    spacing?: DividerVariants["spacing"]
    line?: boolean
  }>(),
  { line: true }
)
</script>

<template>
  <div
    role="separator"
    :class="
      cn(
        dividerVariants({ spacing: props.spacing, line: props.line }),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
