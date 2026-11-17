<script setup lang="ts">
import { ActionRow } from "~~/registry/bases/newt/ui/action-row"
import { Button } from "~~/registry/bases/newt/ui/button"
import { Divider } from "~~/registry/bases/newt/ui/divider"
import { TextDisplay } from "~~/registry/bases/newt/ui/text-display"
import { V2Container } from "~~/registry/bases/newt/ui/v2-container"
</script>

<template>
  <V2Container accent-color="var(--newt-brand)">
    <TextDisplay size="heading-3">Server rules</TextDisplay>
    <Divider spacing="small" />
    <TextDisplay>
      Be kind, keep it on topic, and read the pinned messages before asking.
    </TextDisplay>
    <ActionRow aria-label="Rules actions">
      <Button variant="primary" size="message">I agree</Button>
      <Button variant="link" size="message">Read more</Button>
    </ActionRow>
  </V2Container>
</template>
