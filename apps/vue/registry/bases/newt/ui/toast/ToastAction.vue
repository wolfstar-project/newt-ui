<script setup lang="ts">
import { ToastAction, useForwardProps, type ToastActionProps } from "reka-ui"

/*
 * A button that acts on the toast and then closes it. It has no look of its
 * own; wrap a Button with `as-child`. `altText` tells a screen reader user
 * another way to do the same thing, because the toast can be gone before
 * they reach the button.
 */
const props = defineProps<ToastActionProps & { altText: string }>()

const forwarded = useForwardProps(props)
</script>

<template>
  <ToastAction v-bind="forwarded">
    <slot />
  </ToastAction>
</template>
