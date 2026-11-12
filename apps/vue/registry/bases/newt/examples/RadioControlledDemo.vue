<script setup lang="ts">
import { ref } from "vue"
import { Radio, RadioGroup } from "~~/registry/bases/newt/ui/radio"

const display = ref("cozy")
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-3">
    <RadioGroup v-model="display" label="Message display">
      <Radio value="cozy">Cozy</Radio>
      <Radio value="compact">Compact</Radio>
    </RadioGroup>
    <p
      class="rounded-md bg-newt-bg-elevated px-3 py-2 text-sm text-newt-text-secondary"
      aria-live="polite"
    >
      {{
        display === "compact"
          ? "Avatars are hidden and more messages fit on the screen."
          : "Avatars are shown and messages have room to breathe."
      }}
    </p>
  </div>
</template>
