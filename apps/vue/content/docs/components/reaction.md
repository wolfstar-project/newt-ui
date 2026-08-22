---
title: Reaction Pill
description: A toggleable emoji reaction pill with a count, as seen under chat messages.
---

<ComponentPreview name="ReactionDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add reaction
```

## Usage

```vue
<script setup lang="ts">
import { Reaction } from "@/components/ui/reaction"
</script>

<template>
  <Reaction emoji="👍" :count="12" default-active />
  <Reaction emoji="🚀" :count="4" />
</template>
```

## Examples

### Controlled

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Reaction } from "@/components/ui/reaction"

const active = ref(false)
</script>

<template>
  <Reaction v-model:active="active" emoji="🔥" :count="active ? 8 : 7" />
</template>
```
