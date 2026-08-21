<script setup lang="ts">
import { ref } from "vue"

import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastTitle,
} from "@/lib/registry/default/ui/toast"

const key = ref(0)
</script>

<template>
  <div class="flex flex-col items-start gap-4">
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
</template>
