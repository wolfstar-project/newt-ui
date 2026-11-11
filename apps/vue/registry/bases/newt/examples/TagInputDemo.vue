<script setup lang="ts">
import { ref } from "vue"
import { Field, FieldHelp, Label } from "~~/registry/bases/newt/ui/form-fields"
import { TagInput } from "~~/registry/bases/newt/ui/tag-input"

const tags = ref<readonly string[]>(["moderation", "music"])
</script>

<template>
  <Field class="w-full max-w-sm">
    <Label for="newt-tag-input-example">Server tags</Label>
    <TagInput
      id="newt-tag-input-example"
      v-model="tags"
      placeholder="Add a tag"
      :max="5"
    />
    <FieldHelp>
      {{ tags.length }} of 5. Press Enter or a comma to add one.
    </FieldHelp>
  </Field>
</template>
