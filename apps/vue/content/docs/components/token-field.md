---
title: Token Field
description: A read-only, masked monospace input with reveal and copy-to-clipboard actions for secrets such as bot tokens.
---

<ComponentPreview name="TokenFieldDemo" />

## Installation

```bash
npx @newtui/vue@latest add token-field
```

## Usage

```vue
<script setup lang="ts">
import { TokenField } from "@/components/ui/token-field"
</script>

<template>
  <Label for="bot-token">Bot token</Label>
  <TokenField id="bot-token" :value="token" />
</template>
```

The value is masked until **Reveal** is pressed (the button then reads **Hide**). **Copy** writes the value to the clipboard, emits `copy`, and shows **Copied!** for `copiedDuration` ms (default 1500). Labels can be customised via `revealLabel`, `hideLabel`, `copyLabel` and `copiedLabel`.
