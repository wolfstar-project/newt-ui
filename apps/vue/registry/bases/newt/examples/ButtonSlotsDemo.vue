<script setup lang="ts">
import { Button } from "~~/registry/bases/newt/ui/button"
</script>

<template>
  <!--
    Any icon component works the same way; this one is inline to stay
    offline. A unicode emoji is text: hide it when the label already says the
    action.
  -->
  <div class="flex flex-wrap items-center gap-3">
    <Button size="message" variant="secondary">
      <template #leading>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
          class="h-4 w-4"
        >
          <path
            fill="currentColor"
            d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5Z"
          />
        </svg>
      </template>
      Add role
    </Button>
    <Button size="message">
      <template #leading><span aria-hidden="true">🎉</span></template>
      Celebrate
    </Button>
    <Button size="message" variant="success">
      Accept
      <template #trailing><span aria-hidden="true">✅</span></template>
    </Button>
  </div>
</template>
