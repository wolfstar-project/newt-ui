<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * A real `<table>`, so rows, columns and headers are announced as what they
 * are. The wrapper is what scrolls sideways on a narrow screen, which keeps
 * the table itself from pushing the page wide. `class` and other attributes
 * land on the table; the wrapper takes `wrapperClass`.
 */
defineOptions({ inheritAttrs: false })

const props = defineProps<{
  class?: HTMLAttributes["class"]
  wrapperClass?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    :class="
      cn(
        'w-full overflow-x-auto rounded-md border border-newt-border bg-newt-bg-surface',
        props.wrapperClass
      )
    "
  >
    <table
      v-bind="$attrs"
      :class="
        cn(
          'w-full border-collapse text-sm leading-5 text-newt-text-secondary',
          props.class
        )
      "
    >
      <slot />
    </table>
  </div>
</template>
