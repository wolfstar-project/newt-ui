<script setup lang="ts">
import { computed, ref } from "vue"
import { FieldHelp } from "~~/registry/bases/newt/ui/form-fields"
import { PinInput } from "~~/registry/bases/newt/ui/pin-input"

const EXPECTED = "204816"

/* The error clears as soon as the code is edited, not on the next submit. */
const code = ref("204861")
const invalid = computed(
  () => code.value.length === EXPECTED.length && code.value !== EXPECTED
)
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <PinInput
      v-model="code"
      label="Two-factor code"
      :group-size="3"
      :invalid="invalid"
    />
    <FieldHelp v-if="invalid" variant="error">
      That code did not match. Check it and try again.
    </FieldHelp>
    <FieldHelp v-else>
      Enter the 6-digit code from your authenticator.
    </FieldHelp>
  </div>
</template>
