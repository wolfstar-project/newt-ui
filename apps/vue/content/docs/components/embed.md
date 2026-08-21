---
title: Embed
description: A Discord-style rich message embed with title, description, fields and footer.
---

<ComponentPreview name="EmbedDemo" />

## Installation

```bash
npx newt-ui-vue@latest add embed
```

## Usage

```vue
<script setup lang="ts">
import {
  Embed,
  EmbedDescription,
  EmbedEyebrow,
  EmbedField,
  EmbedFieldName,
  EmbedFieldValue,
  EmbedFields,
  EmbedFooter,
  EmbedTitle,
} from "@/components/ui/embed"
</script>

<template>
  <Embed>
    <EmbedEyebrow>Source · category</EmbedEyebrow>
    <EmbedTitle>Embed title</EmbedTitle>
    <EmbedDescription>Embed description text goes here.</EmbedDescription>
    <EmbedFields>
      <EmbedField>
        <EmbedFieldName>Field</EmbedFieldName>
        <EmbedFieldValue>Value</EmbedFieldValue>
      </EmbedField>
    </EmbedFields>
    <EmbedFooter>Footer text · Just now</EmbedFooter>
  </Embed>
</template>
```
