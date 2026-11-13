<script setup lang="ts">
import { ToastClose, useForwardProps, type ToastCloseProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  ToastCloseProps & { class?: HTMLAttributes["class"] }
>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
const forwarded = useForwardProps(delegated)
</script>

<template>
  <ToastClose
    aria-label="Dismiss"
    v-bind="forwarded"
    :class="
      cn(
        'shrink-0 cursor-pointer border-0 bg-transparent p-0 text-base leading-none text-newt-text-muted transition-colors duration-fast ease-newt hover:text-newt-text-primary',
        props.class
      )
    "
  >
    <slot>&times;</slot>
  </ToastClose>
</template>
