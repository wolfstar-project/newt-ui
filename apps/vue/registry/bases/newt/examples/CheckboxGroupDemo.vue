<script setup lang="ts">
import { ref } from "vue"
import {
  CheckboxGroup,
  CheckboxOption,
} from "~~/registry/bases/newt/ui/checkbox-group"

const days = ref<readonly string[]>(["mon", "tue"])
</script>

<template>
  <CheckboxGroup
    v-model="days"
    class="w-full max-w-[360px]"
    label="Which days are you free?"
  >
    <CheckboxOption value="mon">Monday</CheckboxOption>
    <CheckboxOption value="tue">Tuesday</CheckboxOption>
    <CheckboxOption value="sat" description="Short notice, but possible">
      Saturday
    </CheckboxOption>
    <CheckboxOption value="sun" disabled>Sunday</CheckboxOption>
  </CheckboxGroup>
</template>
