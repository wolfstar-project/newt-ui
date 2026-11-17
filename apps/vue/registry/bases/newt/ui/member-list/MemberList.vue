<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { memberListSectionKey } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  ariaLabel?: string
  ariaLabelledby?: string
}>()

/* Inside a section, the list is named by the heading of that section. */
const headingId = inject(memberListSectionKey, undefined)
const labelledby = computed(
  () =>
    props.ariaLabelledby ??
    (props.ariaLabel === undefined ? headingId : undefined)
)
</script>

<template>
  <div
    role="list"
    :aria-label="props.ariaLabel"
    :aria-labelledby="labelledby"
    :class="cn('flex flex-col', props.class)"
  >
    <slot />
  </div>
</template>
