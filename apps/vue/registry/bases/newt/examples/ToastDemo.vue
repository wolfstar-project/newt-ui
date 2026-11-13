<script setup lang="ts">
import { ref } from "vue"
import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~~/registry/bases/newt/ui/toast"

/*
 * `static` keeps the viewport in the page flow, so the toast shows inside
 * the preview. An application leaves the class out and the toasts float in
 * the corner of the screen.
 */
const key = ref(0)
</script>

<template>
  <ToastProvider>
    <div class="flex flex-col items-start gap-4">
      <ToastViewport class="static items-start" />
      <Toast :key="key" variant="success" :duration="5000">
        <ToastIcon />
        <ToastContent>
          <ToastTitle>Success title</ToastTitle>
          <ToastDescription>Description text.</ToastDescription>
        </ToastContent>
        <ToastClose />
      </Toast>
      <button
        type="button"
        class="rounded-sm bg-newt-brand px-3 py-1.5 text-sm font-medium text-white transition-colors duration-fast ease-newt hover:bg-newt-brand-hover"
        @click="key++"
      >
        Show toast again
      </button>
    </div>
  </ToastProvider>
</template>
