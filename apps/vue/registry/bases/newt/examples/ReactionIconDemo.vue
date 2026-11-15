<script setup lang="ts">
import { Reaction, ReactionGroup } from "~~/registry/bases/newt/ui/reaction"
</script>

<template>
  <!--
    The default slot draws the emoji, here an inline icon that stands in for
    any icon component. `emoji-alt` still names it for a screen reader.
  -->
  <ReactionGroup>
    <Reaction emoji-alt="star" :count="2" default-active>
      <svg viewBox="0 0 24 24" focusable="false" class="h-4 w-4">
        <path
          fill="currentColor"
          d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
        />
      </svg>
    </Reaction>
    <Reaction emoji="🔥" :count="3" />
  </ReactionGroup>
</template>
