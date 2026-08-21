---
title: Permission Row
description: A settings row with a deny / inherit / allow tri-state toggle.
---

<ComponentPreview name="PermissionDemo" />

## Installation

```bash
npx @wolfstar/newt-ui-vue@latest add permission
```

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue"
import {
  Permission,
  PermissionDescription,
  PermissionInfo,
  PermissionName,
  PermissionStates,
  type PermissionValue,
} from "@/components/ui/permission"

const value = ref<PermissionValue>("inherit")
</script>

<template>
  <Permission>
    <PermissionInfo>
      <PermissionName>Manage Channels</PermissionName>
      <PermissionDescription
        >Create, edit and delete channels.</PermissionDescription
      >
    </PermissionInfo>
    <PermissionStates v-model="value" aria-label="Manage Channels" />
  </Permission>
</template>
```

`PermissionStates` uses `v-model` with a `"deny" | "inherit" | "allow"` value. Stack several `Permission` rows inside a container; every row except the last draws a bottom border.
