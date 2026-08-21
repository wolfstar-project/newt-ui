---
title: Form Fields
description: Inputs, textareas, selects, labels, helper text, switches and checkboxes styled for the newt/ui dark theme.
---

<ComponentPreview name="FormFieldsDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add form-fields
```

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue"
import {
  Checkbox,
  Field,
  FieldHelp,
  Input,
  Label,
  Switch,
  Textarea,
} from "@/components/ui/form-fields"

const email = ref("")
const enabled = ref(false)
const remember = ref(true)
</script>

<template>
  <Field>
    <Label for="email">Email</Label>
    <Input
      id="email"
      v-model="email"
      type="email"
      placeholder="you@example.com"
    />
    <FieldHelp>We will never share your email.</FieldHelp>
  </Field>

  <Field>
    <Label for="bio">About me</Label>
    <Textarea id="bio" placeholder="Tell us about yourself" />
  </Field>

  <Switch v-model="enabled" aria-label="Enable" />

  <label class="flex items-center gap-2">
    <Checkbox v-model="remember" />
    <span>Remember me</span>
  </label>
</template>
```

`Switch` and `Checkbox` support `v-model` with a boolean. `Input`, `Textarea` and `Select` support `v-model` on their native value.
