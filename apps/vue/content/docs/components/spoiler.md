---
title: Spoiler
description: Inline text hidden behind a dark block until the reader clicks to reveal it.
---

<ComponentPreview name="SpoilerDemo" />

## Installation

```bash
npx @newtui/vue@latest add spoiler
```

## Usage

```vue
<script setup lang="ts">
import { Spoiler } from "@/components/ui/spoiler"
</script>

<template>
  <p>The ending was <Spoiler>hidden text</Spoiler> all along.</p>
</template>
```

## Examples

### Controlled

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Spoiler } from "@/components/ui/spoiler"

const revealed = ref(false)
</script>

<template>
  <Spoiler v-model:revealed="revealed">hidden text</Spoiler>
</template>
```
