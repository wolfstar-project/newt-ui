<script setup lang="ts">
import { ActionRow } from "@/lib/registry/default/ui/action-row"
import { Button } from "@/lib/registry/default/ui/button"
import { Divider } from "@/lib/registry/default/ui/divider"
import { V2Container } from "@/lib/registry/default/ui/v2-container"
</script>

<template>
  <V2Container accent-color="var(--newt-brand)">
    <strong>Server rules</strong>
    <Divider spacing="sm" />
    <span>
      Be kind, keep it on topic, and read the pinned messages before asking.
    </span>
    <ActionRow aria-label="Rules actions">
      <Button variant="primary">I agree</Button>
      <Button variant="link">Read more</Button>
    </ActionRow>
  </V2Container>
</template>
