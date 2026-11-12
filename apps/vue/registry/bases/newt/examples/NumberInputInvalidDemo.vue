<script setup lang="ts">
import { computed, ref } from "vue"
import { Field, FieldHelp, Label } from "~~/registry/bases/newt/ui/form-fields"
import { NumberInput } from "~~/registry/bases/newt/ui/number-input"

const CONNECTED = 12

/*
 * `min` and `max` clamp what the control can say; `invalid` is for a rule the
 * control cannot know, such as how many people are already in the channel.
 */
const limit = ref(8)
const invalid = computed(() => limit.value < CONNECTED)
</script>

<template>
  <Field class="items-start">
    <Label for="newt-number-input-invalid">User limit</Label>
    <NumberInput
      id="newt-number-input-invalid"
      v-model="limit"
      :min="1"
      :max="99"
      :invalid="invalid"
      aria-describedby="newt-number-input-invalid-help"
    />
    <FieldHelp
      v-if="invalid"
      id="newt-number-input-invalid-help"
      variant="error"
    >
      {{ CONNECTED }} members are connected. Pick {{ CONNECTED }} or more.
    </FieldHelp>
    <FieldHelp v-else id="newt-number-input-invalid-help">
      Up to {{ limit }} members can join this voice channel.
    </FieldHelp>
  </Field>
</template>
