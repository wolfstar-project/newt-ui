<script setup lang="ts">
import { ref } from "vue"
import {
  Field,
  FieldHelp,
  Label,
  Select,
} from "~~/registry/bases/newt/ui/form-fields"

const duration = ref("1d")
</script>

<template>
  <Field class="w-full max-w-sm">
    <Label for="newt-select-example">Hide after inactivity</Label>
    <Select id="newt-select-example" v-model="duration">
      <option value="1h">1 hour</option>
      <option value="1d">24 hours</option>
      <option value="3d">3 days</option>
      <option value="1w">1 week</option>
    </Select>
    <FieldHelp>Quiet threads leave the channel list after this long.</FieldHelp>
  </Field>
</template>
