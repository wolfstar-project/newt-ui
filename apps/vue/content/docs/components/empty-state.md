---
title: Empty State
description: A centered placeholder with an icon, title, and hint shown when a list or view has no content.
---

<ComponentPreview name="EmptyStateDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add empty-state
```

## Usage

```vue
<script setup lang="ts">
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "@/components/ui/empty-state"
</script>

<template>
  <EmptyState>
    <EmptyStateIcon>📭</EmptyStateIcon>
    <EmptyStateTitle>Nothing here yet</EmptyStateTitle>
    <EmptyStateDescription
      >Description of what to do next.</EmptyStateDescription
    >
  </EmptyState>
</template>
```
