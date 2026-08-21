---
title: Status Indicator
description: A presence dot anchored to an avatar, with online, idle, do-not-disturb, offline and streaming states.
---

<ComponentPreview name="StatusIndicatorDemo" />

## Installation

```bash
npx newt-ui-vue@latest add status-indicator
```

## Usage

```vue
<script setup lang="ts">
import { StatusDot, StatusIndicator } from "@/components/ui/status-indicator"
</script>

<template>
  <StatusIndicator aria-label="Online">
    <Avatar>A</Avatar>
    <StatusDot status="online" />
  </StatusIndicator>
</template>
```

`StatusDot` accepts `status` of `online`, `idle`, `dnd`, `offline` (default) or `streaming`. The online dot renders a pulsing presence ring, disabled under `prefers-reduced-motion`.
