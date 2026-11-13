<script setup lang="ts">
import {
  ToastViewport,
  useForwardProps,
  type ToastViewportProps,
} from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The list every toast of the provider is rendered into, wherever the toast
 * itself is written. It floats at the bottom inline-end corner. Pass
 * `class="static items-start"` to lay it out in the page flow instead.
 */
const props = defineProps<
  ToastViewportProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToastViewport
    v-bind="forwarded"
    :class="
      cn(
        'fixed bottom-4 end-4 z-[130] m-0 flex max-w-[calc(100vw-2rem)] list-none flex-col items-end gap-3 p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  />
</template>
