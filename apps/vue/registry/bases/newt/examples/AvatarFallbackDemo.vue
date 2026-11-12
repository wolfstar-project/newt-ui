<script setup lang="ts">
import { Avatar, AvatarFallback } from "~~/registry/bases/newt/ui/avatar"
</script>

<template>
  <!--
    Initials on their own are not a name, so a lone avatar is an image with a
    label. The fill is a token utility passed through `class`.
  -->
  <div class="flex items-center gap-4">
    <Avatar role="img" aria-label="Mira Okafor">
      <AvatarFallback>MO</AvatarFallback>
    </Avatar>
    <Avatar role="img" aria-label="Jun Park" class="bg-newt-online">
      <AvatarFallback>JP</AvatarFallback>
    </Avatar>
    <Avatar role="img" aria-label="Sam Reyes" class="bg-newt-danger">
      <AvatarFallback>SR</AvatarFallback>
    </Avatar>
    <Avatar
      role="img"
      aria-label="Deleted user"
      class="bg-newt-bg-elevated text-newt-text-muted"
    >
      <AvatarFallback>?</AvatarFallback>
    </Avatar>
  </div>
</template>
