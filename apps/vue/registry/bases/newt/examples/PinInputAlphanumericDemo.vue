<script setup lang="ts">
import { ref } from "vue"
import { PinInput } from "~~/registry/bases/newt/ui/pin-input"

const code = ref("k7qd")
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <PinInput
      v-model="code"
      label="Backup code"
      type="alphanumeric"
      :length="8"
      :group-size="4"
    />
    <p class="text-xs text-newt-text-muted" aria-live="polite">
      {{ code.length }} of 8 characters
    </p>
  </div>
</template>
