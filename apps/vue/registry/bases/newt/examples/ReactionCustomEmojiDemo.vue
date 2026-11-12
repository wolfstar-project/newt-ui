<script setup lang="ts">
import { Reaction, ReactionGroup } from "~~/registry/bases/newt/ui/reaction"

/* Inline so the demo never reaches out to the network for an emoji. */
const LEAF =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%2323a55a' d='M4 20c0-9 6-16 16-16 0 10-7 16-16 16Z'/%3E%3C/svg%3E"

/* `emojiSrc` draws the image; `emojiAlt` is what a screen reader calls it. */
</script>

<template>
  <ReactionGroup>
    <Reaction :emoji-src="LEAF" emoji-alt=":leaf:" :count="7" default-active />
    <Reaction emoji="🔥" :count="3" />
  </ReactionGroup>
</template>
