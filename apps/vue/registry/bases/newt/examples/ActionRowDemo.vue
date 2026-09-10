<script setup lang="ts">
import { ActionRow } from "~~/registry/bases/newt/ui/action-row"
import { Button } from "~~/registry/bases/newt/ui/button"
</script>

<template>
  <ActionRow aria-label="Message actions">
    <Button variant="primary">Accept</Button>
    <Button variant="secondary">Decline</Button>
  </ActionRow>
</template>
