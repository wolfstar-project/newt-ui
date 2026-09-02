---
title: Badge
description: A small pill used to label status, counts or categories.
---

<ComponentPreview name="BadgeDemo" />

## Installation

```bash
npx @newtui/vue@latest add badge
```

## Usage

```vue
<script setup lang="ts">
import { Badge } from "@/components/ui/badge"
</script>

<template>
  <Badge variant="success" dot>Online</Badge>
</template>
```

## Examples

### Variants

`default`, `brand`, `success`, `warning` and `danger`.

```vue
<Badge>Default</Badge>
<Badge variant="brand">Brand</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
```
