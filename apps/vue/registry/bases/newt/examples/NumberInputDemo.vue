<script setup lang="ts">
import { ref } from "vue"
import { Field, FieldHelp, Label } from "~~/registry/bases/newt/ui/form-fields"
import { NumberInput } from "~~/registry/bases/newt/ui/number-input"

const seconds = ref(15)
</script>

<template>
  <Field class="items-start">
    <Label for="newt-number-input-example">Slowmode</Label>
    <NumberInput
      id="newt-number-input-example"
      v-model="seconds"
      :min="0"
      :max="120"
      :step="5"
    />
    <FieldHelp>
      {{
        seconds === 0
          ? "Members can post freely."
          : `One message every ${seconds} seconds.`
      }}
    </FieldHelp>
  </Field>
</template>
