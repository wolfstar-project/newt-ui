<script setup lang="ts">
import { Label, type LabelProps } from "reka-ui"
import { computed, type HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * Reka Label is a native `<label>` that does not select its text on a double
 * press, so a quick second press on it only reaches the control.
 */
const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>()

const delegated = computed(() => {
  const { class: _class, ...rest } = props
  return rest
})
</script>

<template>
  <Label
    v-bind="delegated"
    :class="
      cn(
        'text-xs font-bold uppercase tracking-[0.02em] text-newt-text-secondary',
        props.class
      )
    "
  >
    <slot />
  </Label>
</template>
