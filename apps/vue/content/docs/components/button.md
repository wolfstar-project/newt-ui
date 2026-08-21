---
title: Button
description: Displays a Discord-styled button with brand, secondary, success, danger, link and icon variants.
---

<ComponentPreview name="ButtonDemo" />

## Installation

```bash
npx newt-ui-vue@latest add button
```

## Usage

```vue
<script setup lang="ts">
import { Button } from "@/components/ui/button"
</script>

<template>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="success">Success</Button>
  <Button variant="danger">Danger</Button>
  <Button variant="link">Link button</Button>
</template>
```

## Examples

### Sizes

```vue
<template>
  <Button size="sm">Small</Button>
  <Button>Default</Button>
  <Button size="lg">Large</Button>
</template>
```

### Icon

```vue
<template>
  <Button variant="icon" size="icon" aria-label="Settings">
    <SettingsIcon class="h-4 w-4" />
  </Button>
</template>
```
