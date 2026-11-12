<script setup lang="ts">
import { Button } from "~~/registry/bases/newt/ui/button"
</script>

<template>
  <!--
    `href` turns any variant into an `<a>`. The link-out glyph is on by default
    for `variant="link"` only; `launchIcon` adds or removes it.
  -->
  <div class="flex flex-wrap items-center gap-3">
    <Button href="/docs/components/button">Get started</Button>
    <Button
      variant="secondary"
      href="https://example.com"
      target="_blank"
      rel="noreferrer"
      launch-icon
    >
      Open dashboard
    </Button>
    <Button variant="link" href="https://example.com">Terms of service</Button>
    <Button variant="link" href="/docs/components/button" :launch-icon="false">
      Skip for now
    </Button>
  </div>
</template>
