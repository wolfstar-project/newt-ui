<script setup lang="ts">
import { ActionRow } from "@/lib/registry/default/ui/action-row"
import { Button } from "@/lib/registry/default/ui/button"
</script>

<template>
  <ActionRow aria-label="Message actions">
    <Button variant="primary">Accept</Button>
    <Button variant="secondary">Decline</Button>
  </ActionRow>
</template>
