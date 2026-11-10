<script setup lang="ts">
import { ref } from "vue"
import { ColorPicker } from "~~/registry/bases/newt/ui/color-picker"
import { RoleTag } from "~~/registry/bases/newt/ui/role-tag"

const colour = ref("#1abc9c")
</script>

<template>
  <div class="flex flex-col items-start gap-3">
    <ColorPicker v-model="colour" label="Role colour" />
    <div class="flex items-center gap-2 text-xs text-newt-text-muted">
      <RoleTag :color="colour">Moderator</RoleTag>
      <span class="font-mono">{{ colour }}</span>
    </div>
  </div>
</template>
