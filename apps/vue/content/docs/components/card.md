---
title: Card
description: A bordered, elevated panel for grouping related content.
---

<ComponentPreview name="CardDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add card
```

## Usage

```vue
<script setup lang="ts">
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
</script>

<template>
  <Card>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Card description text.</CardDescription>
  </Card>
</template>
```
