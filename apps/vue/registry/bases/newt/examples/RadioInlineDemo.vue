<script setup lang="ts">
import { Radio, RadioGroup } from "~~/registry/bases/newt/ui/radio"
</script>

<template>
  <RadioGroup
    class="flex-row flex-wrap gap-x-5"
    label="Theme"
    default-value="dark"
  >
    <Radio value="dark">Dark</Radio>
    <Radio value="light">Light</Radio>
    <Radio value="system">Match system</Radio>
  </RadioGroup>
</template>
