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
  <div class="flex w-full max-w-md flex-col gap-2">
    <Alert variant="info">
      <AlertTitle>A new version is ready</AlertTitle>
      <AlertDescription
        >Reload to pick up the latest commands.</AlertDescription
      >
    </Alert>
    <Alert variant="success">
      <AlertTitle>Roles saved</AlertTitle>
    </Alert>
    <Alert variant="warning">
      <AlertTitle>Slowmode is on</AlertTitle>
      <AlertDescription>
        Members can post one message every 30 seconds in this channel.
      </AlertDescription>
    </Alert>
    <Alert variant="danger">
      <AlertTitle>The bot is offline</AlertTitle>
      <AlertDescription>
        Its token was reset. Paste the new one to bring it back.
      </AlertDescription>
      <AlertActions>
        <Button size="sm" variant="secondary">Update token</Button>
      </AlertActions>
    </Alert>
  </div>
</template>
