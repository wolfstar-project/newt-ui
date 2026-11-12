<script setup lang="ts">
import { Badge } from "~~/registry/bases/newt/ui/badge"
</script>

<template>
  <!-- Each variant says what is being reported; the word carries it too. -->
  <div class="flex flex-wrap items-center gap-2">
    <Badge>Member</Badge>
    <Badge variant="brand">New</Badge>
    <Badge variant="success">Verified</Badge>
    <Badge variant="warning">Pending</Badge>
    <Badge variant="danger">Banned</Badge>
  </div>
</template>
