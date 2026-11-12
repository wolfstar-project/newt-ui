<script setup lang="ts">
import { Field, FieldHelp, Label } from "~~/registry/bases/newt/ui/form-fields"
import { NumberInput } from "~~/registry/bases/newt/ui/number-input"
</script>

<template>
  <Field class="items-start">
    <Label for="newt-number-input-disabled">Upload limit (MB)</Label>
    <NumberInput id="newt-number-input-disabled" :model-value="25" disabled />
    <FieldHelp>Raised by your server's boost level.</FieldHelp>
  </Field>
</template>
