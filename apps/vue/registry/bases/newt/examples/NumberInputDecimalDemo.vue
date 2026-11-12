<script setup lang="ts">
import { ref } from "vue"
import { Field, FieldHelp, Label } from "~~/registry/bases/newt/ui/form-fields"
import { NumberInput } from "~~/registry/bases/newt/ui/number-input"

/* The value keeps as many decimals as the step has, and no more. */
const speed = ref(1)
</script>

<template>
  <Field class="items-start">
    <Label for="newt-number-input-decimal">Playback speed</Label>
    <NumberInput
      id="newt-number-input-decimal"
      v-model="speed"
      :min="0.25"
      :max="2"
      :step="0.25"
      decrement-label="Slower"
      increment-label="Faster"
    />
    <FieldHelp>
      {{
        speed === 1
          ? "Voice messages play at normal speed."
          : `Voice messages play at ${speed}× speed.`
      }}
    </FieldHelp>
  </Field>
</template>
