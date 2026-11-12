<script setup lang="ts">
import {
  SelectMenu,
  type SelectMenuOption,
} from "~~/registry/bases/newt/ui/select-menu"

const OPTIONS: SelectMenuOption[] = [
  { value: "auto", label: "Automatic", note: "(Europe)" },
  { value: "eu", label: "Europe" },
  { value: "us-east", label: "US East" },
]
</script>

<template>
  <div class="flex w-full max-w-[400px] flex-col gap-2">
    <SelectMenu
      model-value="auto"
      :options="OPTIONS"
      label="Voice region"
      disabled
    />
    <p class="text-xs text-newt-text-muted">
      Only the channel owner can change the voice region.
    </p>
  </div>
</template>
