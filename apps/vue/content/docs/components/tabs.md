---
title: Tabs
description: A pill-style tab list that switches the active tab on click.
---

<ComponentPreview name="TabsDemo" />

## Installation

```bash
npx @newtui/vue@latest add tabs
```

## Usage

```vue
<script setup lang="ts">
import { Tabs, TabsTrigger, TabsContent } from "@/components/ui/tabs"
</script>

<template>
  <Tabs default-value="one">
    <TabsTrigger value="one">Tab one</TabsTrigger>
    <TabsTrigger value="two">Tab two</TabsTrigger>
    <TabsTrigger value="three">Tab three</TabsTrigger>
  </Tabs>
</template>
```

## Examples

### Controlled with `v-model`

```vue
<script setup lang="ts">
import { ref } from "vue"
import { Tabs, TabsTrigger } from "@/components/ui/tabs"

const tab = ref("one")
</script>

<template>
  <Tabs v-model="tab">
    <TabsTrigger value="one">Tab one</TabsTrigger>
    <TabsTrigger value="two">Tab two</TabsTrigger>
  </Tabs>
</template>
```
