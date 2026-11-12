<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Field,
  FieldHelp,
  Input,
  Label,
} from "~~/registry/bases/newt/ui/form-fields"

/*
 * `invalid` is said once, on the field: the input inside reads it for its
 * border, and the help line swaps to the variant that is announced.
 */
const name = ref("Game Night!")
const invalid = computed(() => !/^[a-z0-9-]+$/.test(name.value))
</script>

<template>
  <Field :invalid="invalid" class="w-full max-w-sm">
    <Label for="newt-field-error-example">Channel name</Label>
    <Input
      id="newt-field-error-example"
      v-model="name"
      :aria-invalid="invalid"
      aria-describedby="newt-field-error-example-help"
    />
    <FieldHelp
      v-if="invalid"
      id="newt-field-error-example-help"
      variant="error"
    >
      Use lowercase letters, numbers and hyphens only.
    </FieldHelp>
    <FieldHelp v-else id="newt-field-error-example-help">
      Members will see #{{ name }}.
    </FieldHelp>
  </Field>
</template>
