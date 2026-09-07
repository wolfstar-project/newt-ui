<script setup lang="ts">
import { Reaction, ReactionGroup } from "@/lib/registry/default/ui/reaction"
</script>

<template>
  <ReactionGroup>
    <Reaction emoji="👍" :count="12" default-active />
    <Reaction emoji="🚀" :count="4" />
  </ReactionGroup>
</template>
