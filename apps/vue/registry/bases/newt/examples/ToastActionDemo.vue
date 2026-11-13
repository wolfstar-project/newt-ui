<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~~/registry/bases/newt/ui/toast"

/*
 * A toast that offers a way back must not leave on its own: `:duration="0"`
 * keeps it until the reader takes the action or dismisses it.
 */
const open = ref(true)
</script>

<template>
  <ToastProvider>
    <div class="flex min-h-28 flex-col items-start gap-4">
      <ToastViewport class="static items-start" />
      <Toast v-model:open="open" :duration="0">
        <ToastIcon />
        <ToastContent>
          <ToastTitle>Message deleted</ToastTitle>
          <ToastDescription>It is gone for everyone.</ToastDescription>
          <ToastAction alt-text="Restore the message from its menu" as-child>
            <Button variant="secondary" size="sm" class="mt-2">Undo</Button>
          </ToastAction>
        </ToastContent>
        <ToastClose />
      </Toast>
      <Button v-if="!open" variant="secondary" size="sm" @click="open = true">
        Delete another message
      </Button>
    </div>
  </ToastProvider>
</template>
