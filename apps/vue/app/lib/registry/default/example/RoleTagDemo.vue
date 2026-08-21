<script setup lang="ts">
import { RoleTag, RoleTagDot } from "@/lib/registry/default/ui/role-tag"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <RoleTag>
      <RoleTagDot />
      Role name
    </RoleTag>
    <RoleTag color="#5865f2">
      <RoleTagDot />
      Admin
    </RoleTag>
    <RoleTag color="#23a55a">
      <RoleTagDot />
      Moderator
    </RoleTag>
  </div>
</template>
