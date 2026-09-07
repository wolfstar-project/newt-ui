<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  /** The moment to render. Anything `new Date()` accepts. */
  date: Date | number | string
}>()

/*
 * A fixed locale, not the visitor's: an embed rendered on the server and
 * hydrated in the browser has to produce the same string in both places.
 */
const formatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "short",
  timeStyle: "short",
})

const value = computed(() =>
  props.date instanceof Date ? props.date : new Date(props.date)
)
const valid = computed(() => !Number.isNaN(value.value.getTime()))
</script>

<template>
  <time
    :datetime="valid ? value.toISOString() : undefined"
    :class="cn(props.class)"
  >
    <slot>{{ valid ? formatter.format(value) : "" }}</slot>
  </time>
</template>
