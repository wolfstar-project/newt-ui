<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /**
     * `stack` puts rows behind one rounded surface. `grid` lays out
     * `variant="tile"` items in columns.
     */
    variant?: "stack" | "grid"
  }>(),
  { variant: "stack" }
)
</script>

<template>
  <!-- Card that stacks `<AppLauncherItem>` rows behind one rounded surface. -->
  <div
    :class="
      cn(
        props.variant === 'grid'
          ? 'grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2'
          : 'flex flex-col overflow-hidden rounded-[var(--newt-radius-md)] bg-newt-bg-elevated [&>*+*]:border-t [&>*+*]:border-newt-border',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
