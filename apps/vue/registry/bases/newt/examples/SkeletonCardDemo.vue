<script setup lang="ts">
import { Card } from "~~/registry/bases/newt/ui/card"
import { Skeleton } from "~~/registry/bases/newt/ui/skeleton"
</script>

<template>
  <!-- The placeholder keeps the card's real layout, so nothing jumps on arrival. -->
  <Card class="flex w-full max-w-sm flex-col gap-3">
    <Skeleton class="h-28 w-full rounded-md" />
    <Skeleton variant="title" />
    <div class="flex flex-col gap-1.5">
      <Skeleton variant="text" />
      <Skeleton variant="text" class="w-[70%]" />
    </div>
  </Card>
</template>
