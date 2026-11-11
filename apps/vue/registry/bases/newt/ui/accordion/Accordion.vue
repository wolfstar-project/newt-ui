<script setup lang="ts">
import { computed, provide, useId, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { accordionKey } from "."

/*
 * Each section is a native `<details>`: the summary is already a button, it
 * already answers Enter and Space, and find-in-page already opens a closed
 * section that holds a match. `single` gives the sections one `name`, which
 * is how the browser itself keeps only one of them open.
 */
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * `single` closes the open section when another opens; `multiple` lets
     * them open independently.
     */
    type?: "single" | "multiple"
  }>(),
  { type: "single" }
)

const generated = useId()
provide(
  accordionKey,
  computed(() => (props.type === "single" ? generated : undefined))
)
</script>

<template>
  <div
    :class="
      cn(
        'flex w-full flex-col overflow-hidden rounded-md border border-newt-border bg-newt-bg-surface',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
