<script setup lang="ts">
import { ref, watch } from "vue"
import { PinInput } from "~~/registry/bases/newt/ui/pin-input"

const code = ref("481")
const status = ref("Enter the 6-digit code")

watch(code, (next) => {
  if (next.length < 6) status.value = "Enter the 6-digit code"
})
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <PinInput
      v-model="code"
      label="Two-factor code"
      :group-size="3"
      @complete="status = `Checking ${$event}…`"
    />
    <p class="text-xs text-newt-text-muted" aria-live="polite">{{ status }}</p>
  </div>
</template>
