<script setup lang="ts">
import { ref } from "vue"
import { Button } from "~~/registry/bases/newt/ui/button"
import { LoadMore } from "~~/registry/bases/newt/ui/pagination"

/*
 * `LoadMore` is a row, not a button: it holds the control while there is more
 * to fetch, and the closing line once the list has reached its end.
 */
const entries = [
  "Ada changed the server name",
  "Lin created #announcements",
  "Ada gave Sol the Moderator role",
  "Sol deleted 4 messages in #lounge",
  "Lin updated the welcome screen",
  "Sol timed out a member for 10 minutes",
  "Ada created an invite that never expires",
  "Lin renamed #general to #lobby",
]
const step = 3
const shown = ref(step)
</script>

<template>
  <div class="flex w-full max-w-sm flex-col">
    <ul class="flex flex-col gap-2 text-sm text-newt-text-secondary">
      <li v-for="entry in entries.slice(0, shown)" :key="entry">
        {{ entry }}
      </li>
    </ul>
    <LoadMore>
      <Button
        v-if="shown < entries.length"
        variant="secondary"
        size="sm"
        @click="shown += step"
      >
        Load more
      </Button>
      <template v-else>End of the audit log</template>
    </LoadMore>
  </div>
</template>
