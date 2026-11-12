<script setup lang="ts">
import { Skeleton } from "~~/registry/bases/newt/ui/skeleton"
</script>

<template>
  <!-- `default` has no size of its own: it takes whatever shape the classes give it. -->
  <div class="flex w-full max-w-sm flex-col gap-4">
    <div class="flex items-center gap-3">
      <span class="w-14 shrink-0 text-xs text-newt-text-muted">avatar</span>
      <Skeleton variant="avatar" />
    </div>
    <div class="flex items-center gap-3">
      <span class="w-14 shrink-0 text-xs text-newt-text-muted">title</span>
      <div class="flex-1">
        <Skeleton variant="title" />
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="w-14 shrink-0 text-xs text-newt-text-muted">text</span>
      <div class="flex-1">
        <Skeleton variant="text" />
      </div>
    </div>
    <div class="flex items-center gap-3">
      <span class="w-14 shrink-0 text-xs text-newt-text-muted">default</span>
      <div class="flex-1">
        <Skeleton class="h-20 w-full rounded-md" />
      </div>
    </div>
  </div>
</template>
