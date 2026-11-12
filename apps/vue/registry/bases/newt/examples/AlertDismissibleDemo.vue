<script setup lang="ts">
import { ref } from "vue"
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "~~/registry/bases/newt/ui/alert"
import { Button } from "~~/registry/bases/newt/ui/button"

/*
 * The alert keeps no state of its own: the page decides whether it applies,
 * and rendering it again is what makes a screen reader announce it.
 */
const open = ref(true)
</script>

<template>
  <div class="flex w-full max-w-md flex-col items-start gap-2">
    <Alert v-if="open" variant="info">
      <AlertTitle>Welcome to the server</AlertTitle>
      <AlertDescription>
        Read the rules channel before you post for the first time.
      </AlertDescription>
      <AlertActions>
        <Button size="sm" variant="secondary" @click="open = false">
          Got it
        </Button>
      </AlertActions>
    </Alert>
    <Button v-else size="sm" variant="secondary" @click="open = true">
      Show the notice again
    </Button>
  </div>
</template>
