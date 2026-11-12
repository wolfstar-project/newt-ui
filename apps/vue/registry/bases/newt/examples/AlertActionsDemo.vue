<script setup lang="ts">
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "~~/registry/bases/newt/ui/alert"
import { Button } from "~~/registry/bases/newt/ui/button"
</script>

<template>
  <!-- Two answers to one notice: the one that resolves it comes first. -->
  <Alert variant="warning" class="max-w-md">
    <AlertTitle>You have unsaved changes</AlertTitle>
    <AlertDescription>
      The server name and the welcome channel were edited.
    </AlertDescription>
    <AlertActions>
      <Button size="sm" variant="success">Save changes</Button>
      <Button size="sm" variant="secondary">Reset</Button>
    </AlertActions>
  </Alert>
</template>
