---
title: Progress Bar
description: A gradient progress bar for boosts, uploads and other long-running tasks.
---

<ComponentPreview name="ProgressDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add progress
```

## Usage

```vue
<script setup lang="ts">
import { Progress, ProgressLabel } from "@/components/ui/progress"
</script>

<template>
  <ProgressLabel>
    <span>Label</span>
    <span>50%</span>
  </ProgressLabel>
  <Progress :value="50" />
</template>
```

## Examples

### Variants

```vue
<template>
  <Progress :value="65" />
  <Progress :value="80" variant="success" />
  <Progress :value="95" variant="danger" />
</template>
```
