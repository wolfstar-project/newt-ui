<script setup lang="ts">
import { ref } from "vue"
import { Reaction, ReactionGroup } from "~~/registry/bases/newt/ui/reaction"

const OTHERS = 12

/* The pill reports the toggle; the count is the caller's to keep in step. */
const reacted = ref(false)
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <ReactionGroup>
      <Reaction
        v-model:active="reacted"
        emoji="👍"
        :count="OTHERS + (reacted ? 1 : 0)"
      />
    </ReactionGroup>
    <p class="m-0 text-xs text-newt-text-muted" aria-live="polite">
      {{ reacted ? "You reacted" : "You have not reacted" }}
    </p>
  </div>
</template>
