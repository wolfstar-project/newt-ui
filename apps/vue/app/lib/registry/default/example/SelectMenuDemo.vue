<script setup lang="ts">
import { computed, ref } from "vue"

import {
  SelectMenu,
  SelectMenuLabel,
  SelectMenuOption,
  SelectMenuSearch,
} from "@/lib/registry/default/ui/select-menu"

const options = ["Option one", "Option two", "Option three"]
const selected = ref(options[0])
const query = ref("")

const visible = computed(() =>
  options.filter((option) =>
    option.toLowerCase().includes(query.value.trim().toLowerCase())
  )
)
</script>

<template>
  <SelectMenu aria-label="Select an option">
    <SelectMenuSearch
      v-model="query"
      placeholder="Search…"
      aria-label="Search options"
    />
    <SelectMenuLabel>Options</SelectMenuLabel>
    <SelectMenuOption
      v-for="option in visible"
      :key="option"
      :selected="option === selected"
      @click="selected = option"
    >
      {{ option }}
    </SelectMenuOption>
  </SelectMenu>
</template>
