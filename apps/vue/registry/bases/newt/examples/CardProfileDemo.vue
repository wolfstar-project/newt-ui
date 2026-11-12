<script setup lang="ts">
import { Avatar } from "~~/registry/bases/newt/ui/avatar"
import { Badge } from "~~/registry/bases/newt/ui/badge"
import {
  Card,
  CardDescription,
  CardTitle,
} from "~~/registry/bases/newt/ui/card"
</script>

<template>
  <!-- A header row built from other registry parts, then the card's own text. -->
  <Card class="w-full max-w-sm">
    <div class="mb-3 flex items-center gap-3">
      <Avatar aria-hidden="true">R</Avatar>
      <div class="min-w-0 flex-1">
        <CardTitle class="mb-0 truncate">Riverbend Book Club</CardTitle>
        <CardDescription>128 members</CardDescription>
      </div>
      <Badge variant="success" dot>Open</Badge>
    </div>
    <CardDescription>
      One novel a month, a voice chat on the last Sunday, and no spoilers
      outside the reading channel.
    </CardDescription>
  </Card>
</template>
