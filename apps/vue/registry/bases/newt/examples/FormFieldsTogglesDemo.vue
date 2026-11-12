<script setup lang="ts">
import { ref } from "vue"
import { Checkbox, Switch } from "~~/registry/bases/newt/ui/form-fields"

/*
 * A switch takes effect at once; a checkbox is an answer that waits for the
 * form around it. Both are buttons, so each needs a name of its own.
 */
const previews = ref(true)
const remember = ref(true)
</script>

<template>
  <div
    class="flex w-full max-w-sm flex-col gap-4 text-sm text-newt-text-primary"
  >
    <div class="flex items-center justify-between gap-4">
      <span id="newt-toggle-previews">Show link previews</span>
      <Switch v-model="previews" aria-labelledby="newt-toggle-previews" />
    </div>
    <div class="flex items-center justify-between gap-4">
      <span id="newt-toggle-streamer" class="text-newt-text-muted">
        Streamer mode (set by your server)
      </span>
      <Switch aria-labelledby="newt-toggle-streamer" disabled />
    </div>
    <div class="flex items-center gap-3">
      <Checkbox v-model="remember" aria-labelledby="newt-toggle-remember" />
      <span id="newt-toggle-remember">Remember this device</span>
    </div>
    <div class="flex items-center gap-3">
      <Checkbox aria-labelledby="newt-toggle-beta" disabled />
      <span id="newt-toggle-beta" class="text-newt-text-muted">
        Join the beta (invite only)
      </span>
    </div>
  </div>
</template>
