<script setup lang="ts">
import { ref } from "vue"
import { PinInput } from "~~/registry/bases/newt/ui/pin-input"

const pin = ref("27")
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <PinInput v-model="pin" label="Parental PIN" :length="4" mask />
    <p class="text-xs text-newt-text-muted">
      Enter the 4-digit PIN to change these settings
    </p>
  </div>
</template>
