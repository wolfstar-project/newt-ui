<script setup lang="ts">
import { ref } from "vue"

import {
  Permission,
  PermissionDescription,
  PermissionInfo,
  PermissionName,
  PermissionStates,
  type PermissionValue,
} from "@/lib/registry/default/ui/permission"

const value = ref<PermissionValue>("inherit")
</script>

<template>
  <div class="w-full max-w-md">
    <Permission>
      <PermissionInfo>
        <PermissionName>Permission name</PermissionName>
        <PermissionDescription>Permission description.</PermissionDescription>
      </PermissionInfo>
      <PermissionStates v-model="value" aria-label="Permission name" />
    </Permission>
  </div>
</template>
