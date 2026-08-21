<script setup lang="ts">
import { Skeleton } from "@/lib/registry/default/ui/skeleton"
</script>

<template>
  <div class="flex w-full max-w-sm gap-3">
    <Skeleton variant="avatar" />
    <div class="flex flex-1 flex-col gap-1.5">
      <Skeleton variant="title" />
      <Skeleton variant="text" class="w-[80%]" />
    </div>
  </div>
</template>
