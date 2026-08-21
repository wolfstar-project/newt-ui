<script setup lang="ts">
import { ref } from "vue"

import {
  Field,
  FieldHelp,
  Input,
  Label,
  Switch,
} from "@/lib/registry/default/ui/form-fields"

const value = ref("")
const enabled = ref(false)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col gap-6">
    <Field>
      <Label for="newt-input-example">Label</Label>
      <Input
        id="newt-input-example"
        v-model="value"
        placeholder="Placeholder"
      />
      <FieldHelp>Helper text</FieldHelp>
    </Field>

    <div class="flex items-center justify-between text-newt-text-primary">
      <span>Toggle label</span>
      <Switch v-model="enabled" aria-label="Toggle label" />
    </div>
  </div>
</template>
