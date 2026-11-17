<script setup lang="ts">
import { Divider } from "~~/registry/bases/newt/ui/divider"
import { TextDisplay } from "~~/registry/bases/newt/ui/text-display"
import { V2Container } from "~~/registry/bases/newt/ui/v2-container"

/* A `\n` in the text is a line break on screen: the part keeps them. */
const rules =
  "Be kind and keep it on topic.\nRead the pinned messages before asking."
</script>

<template>
  <V2Container>
    <TextDisplay size="heading-1">Welcome aboard</TextDisplay>
    <TextDisplay size="heading-2">Server rules</TextDisplay>
    <TextDisplay>{{ rules }}</TextDisplay>
    <Divider spacing="small" />
    <TextDisplay size="heading-3">Roles</TextDisplay>
    <TextDisplay>Pick a colour in the roles channel.</TextDisplay>
    <TextDisplay size="subtext">Updated by the moderators</TextDisplay>
  </V2Container>
</template>
