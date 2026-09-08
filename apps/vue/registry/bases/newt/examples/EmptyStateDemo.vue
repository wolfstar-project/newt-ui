<script setup lang="ts">
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateIcon,
  EmptyStateTitle,
} from "~~/registry/bases/newt/ui/empty-state"
</script>

<template>
  <EmptyState>
    <EmptyStateIcon>📭</EmptyStateIcon>
    <EmptyStateTitle>Nothing here yet</EmptyStateTitle>
    <EmptyStateDescription
      >Description of what to do next.</EmptyStateDescription
    >
  </EmptyState>
</template>
