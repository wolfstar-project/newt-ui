<script setup lang="ts">
import { ref } from "vue"

import { SelectMenu } from "@/lib/registry/default/ui/select-menu"

const OPTIONS = [
  { value: "one", label: "Option one", description: "What this option does" },
  { value: "two", label: "Option two" },
  { value: "three", label: "Option three", disabled: true },
]

const value = ref<string>()
</script>

<template>
  <SelectMenu v-model="value" :options="OPTIONS" label="Select an option" />
</template>
