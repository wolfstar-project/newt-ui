<script setup lang="ts">
import { Badge } from "@/lib/registry/default/ui/badge"
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <Badge variant="brand" dot>Brand</Badge>
    <Badge variant="success" dot>Online</Badge>
    <Badge variant="danger" dot>Error</Badge>
  </div>
</template>
