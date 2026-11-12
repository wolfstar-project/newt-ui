<script setup lang="ts">
import { Button } from "~~/registry/bases/newt/ui/button"
</script>

<template>
  <!--
    A button is disabled by the browser. A link has no `disabled`, so the last
    one loses its `href` and carries `aria-disabled` instead.
  -->
  <div class="flex flex-wrap items-center gap-3">
    <Button disabled>Save changes</Button>
    <Button variant="secondary" disabled>Cancel</Button>
    <Button variant="danger" disabled>Delete server</Button>
    <Button variant="link" href="/docs/components/button" disabled>
      Read the guide
    </Button>
  </div>
</template>
