<script setup lang="ts">
import { useStore } from "@nanostores/vue"
import { computed, defineAsyncComponent, type Component } from "vue"

import { vueDemos } from "@/lib/registry-client"
import { $framework } from "@/stores/framework"

/*
 * The Vue half of a preview. It mounts alongside the React island and stays
 * empty until the reader switches framework, so neither runtime is loaded for
 * a framework nobody asked about.
 */
const props = defineProps<{ demo: string }>()

const framework = useStore($framework)

const demo = computed<Component | undefined>(() => {
  const load = vueDemos.get(props.demo)
  return load === undefined ? undefined : defineAsyncComponent(load)
})
</script>

<template>
  <template v-if="framework === 'vue'">
    <component :is="demo" v-if="demo" />
    <p v-else class="demo-error">No Vue demo named {{ props.demo }}.</p>
  </template>
</template>
