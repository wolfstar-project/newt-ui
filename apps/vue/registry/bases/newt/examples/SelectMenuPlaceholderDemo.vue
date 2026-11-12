<script setup lang="ts">
import {
  SelectMenu,
  type SelectMenuOption,
} from "~~/registry/bases/newt/ui/select-menu"

const OPTIONS: SelectMenuOption[] = [
  { value: "auto", label: "Automatic" },
  { value: "eu", label: "Europe" },
  { value: "us-east", label: "US East" },
  { value: "us-west", label: "US West" },
  { value: "asia", label: "Asia Pacific" },
]

/* Nothing is chosen yet, so the trigger says what it is waiting for. */
</script>

<template>
  <SelectMenu
    :options="OPTIONS"
    label="Voice region"
    placeholder="Choose a voice region"
  />
</template>
