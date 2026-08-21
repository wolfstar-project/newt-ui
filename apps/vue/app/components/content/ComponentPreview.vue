<script setup lang="ts">
import { computed } from "vue"

import { Index } from "@/__registry__"

const props = defineProps<{ name: string }>()
const demo = computed(() => Index.default[props.name]?.component)
</script>

<template>
  <div
    class="my-6 rounded-lg border border-newt-border bg-newt-bg-elevated p-8"
  >
    <component :is="demo" v-if="demo" />
    <p v-else class="text-newt-text-muted">
      Component {{ name }} not found in registry.
    </p>
  </div>
</template>
