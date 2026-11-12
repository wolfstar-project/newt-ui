<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import {
  Toast,
  ToastClose,
  ToastContent,
  ToastIcon,
  ToastTitle,
} from "~~/registry/bases/newt/ui/toast"

/*
 * The parent owns `open`: an action raises the toast, and the timer or the
 * close button hands `false` back through `update:open`.
 */
const open = ref(false)
</script>

<template>
  <div class="flex min-h-28 flex-col items-start gap-4">
    <Button @click="open = true">Copy invite link</Button>
    <Toast v-model:open="open" :duration="3000">
      <ToastIcon />
      <ToastContent>
        <ToastTitle>Invite link copied</ToastTitle>
      </ToastContent>
      <ToastClose />
    </Toast>
  </div>
</template>
