<script setup lang="ts">
import { Reaction } from "@/lib/registry/default/ui/reaction"
</script>

<template>
  <div class="flex items-center gap-2">
    <Reaction emoji="👍" :count="12" default-active />
    <Reaction emoji="🚀" :count="4" />
  </div>
</template>
