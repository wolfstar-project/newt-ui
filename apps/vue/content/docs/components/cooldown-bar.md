---
title: Cooldown Bar
description: A slim progress bar with a label and monospace countdown for command cooldowns.
---

<ComponentPreview name="CooldownBarDemo" />

## Installation

```bash
npx newt-ui-vue@latest add cooldown-bar
```

## Usage

```vue
<script setup lang="ts">
import {
  CooldownBar,
  CooldownBarLabel,
  CooldownBarTrack,
  CooldownBarValue,
} from "@/components/ui/cooldown-bar"
</script>

<template>
  <CooldownBar>
    <CooldownBarLabel>
      <span>Command cooldown</span>
      <CooldownBarValue>3.2s</CooldownBarValue>
    </CooldownBarLabel>
    <CooldownBarTrack :value="40" aria-label="Command cooldown" />
  </CooldownBar>
</template>
```

Pass `ready` to `CooldownBarTrack` to switch the fill from idle yellow to online green.
