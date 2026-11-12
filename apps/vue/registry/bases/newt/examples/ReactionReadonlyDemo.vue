<script setup lang="ts">
import { Reaction, ReactionGroup } from "~~/registry/bases/newt/ui/reaction"

/* `readonly` shows the tally as text: no button, no hover, no tab stop. */
</script>

<template>
  <ReactionGroup>
    <Reaction emoji="🎉" :count="31" readonly />
    <Reaction emoji="❤️" :count="8" readonly active />
    <Reaction emoji="👀" :count="2" readonly />
  </ReactionGroup>
</template>
