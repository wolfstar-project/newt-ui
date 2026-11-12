<script setup lang="ts">
import {
  CheckboxGroup,
  CheckboxOption,
} from "~~/registry/bases/newt/ui/checkbox-group"
</script>

<template>
  <CheckboxGroup
    class="flex-row flex-wrap gap-x-6 gap-y-3"
    label="Where do you play?"
    :default-value="['desktop']"
  >
    <CheckboxOption value="desktop">Desktop</CheckboxOption>
    <CheckboxOption value="console">Console</CheckboxOption>
    <CheckboxOption value="mobile">Mobile</CheckboxOption>
  </CheckboxGroup>
</template>
