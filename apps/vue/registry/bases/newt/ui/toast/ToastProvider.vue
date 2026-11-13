<script setup lang="ts">
import {
  ToastProvider,
  useForwardProps,
  type ToastProviderProps,
} from "reka-ui"

/*
 * Reka owns the behaviour: the dismiss timer and its pause on hover, focus
 * and window blur, swipe to dismiss, Escape, and the announcement to screen
 * readers. Only the look is newt/ui's. Every toast needs a `ToastProvider`
 * above it and a `ToastViewport` inside that provider.
 */
const props = defineProps<ToastProviderProps>()

const forwarded = useForwardProps(props)
</script>

<template>
  <ToastProvider v-bind="forwarded">
    <slot />
  </ToastProvider>
</template>
