<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    /** Option name, rendered in monospace. */
    name: string
    /** Option type, e.g. `STRING`, `USER`, `INTEGER`. */
    type?: string
    /** Marks the option as required. */
    required?: boolean
    /** Label used for the required marker. */
    requiredLabel?: string
    /** Human readable description. */
    description?: string
    class?: HTMLAttributes["class"]
  }>(),
  { required: false, requiredLabel: "required" }
)
</script>

<template>
  <div :class="cn('flex items-baseline gap-2.5 text-xs', props.class)">
    <span class="shrink-0 font-mono font-semibold text-newt-text-primary">
      {{ props.name }}
    </span>
    <span
      v-if="props.type"
      class="shrink-0 font-mono text-[11px] text-newt-text-muted"
    >
      {{ props.type }}
    </span>
    <span
      v-if="props.required"
      class="shrink-0 text-[11px] font-bold text-newt-dnd"
    >
      {{ props.requiredLabel }}
    </span>
    <span
      v-if="props.description || $slots.default"
      class="text-newt-text-muted"
    >
      <slot>{{ props.description }}</slot>
    </span>
  </div>
</template>
