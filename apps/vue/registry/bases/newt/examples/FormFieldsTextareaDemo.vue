<script setup lang="ts">
import { ref } from "vue"
import {
  Field,
  FieldHelp,
  Label,
  Textarea,
} from "~~/registry/bases/newt/ui/form-fields"

const LIMIT = 120

const topic = ref("Patch notes, release dates and nothing else.")
</script>

<template>
  <Field class="w-full max-w-sm">
    <Label for="newt-textarea-example">Channel topic</Label>
    <Textarea
      id="newt-textarea-example"
      v-model="topic"
      rows="3"
      :maxlength="LIMIT"
      placeholder="Let everyone know what this channel is for"
    />
    <FieldHelp>{{ topic.length }} of {{ LIMIT }} characters</FieldHelp>
  </Field>
</template>
