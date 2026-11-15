<script lang="ts">
/*
 * Astro mounts every island as its own Vue app, and `useId` counts per app.
 * Two demos on one page would hand out the same ids, so a list in the second
 * demo would take its name from a heading in the first. Each island gets its
 * own prefix instead.
 */
let islands = 0
</script>

<script setup lang="ts">
import { useStore } from "@nanostores/vue"
import {
  computed,
  defineAsyncComponent,
  getCurrentInstance,
  type Component,
} from "vue"

import { vueDemos } from "@/lib/registry-client"
import { $framework } from "@/stores/framework"

/*
 * The Vue half of a preview. It mounts alongside the React island and stays
 * empty until the reader switches framework, so neither runtime is loaded for
 * a framework nobody asked about.
 */
const props = defineProps<{ demo: string }>()

const config = getCurrentInstance()?.appContext.config
if (config !== undefined) {
  islands += 1
  config.idPrefix = `newt-demo-${islands}`
}

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
