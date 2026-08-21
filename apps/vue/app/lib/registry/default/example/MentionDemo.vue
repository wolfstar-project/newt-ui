<script setup lang="ts">
import { Mention } from "@/lib/registry/default/ui/mention"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Mention variant="user">@username</Mention>
    <Mention variant="channel">#channel</Mention>
    <Mention variant="role">@RoleName</Mention>
  </div>
</template>
