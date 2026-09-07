<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"]
    /** Keeps a toggled action (such as the member list) lit up. */
    active?: boolean
  }>(),
  { active: false }
)
</script>

<template>
  <button
    type="button"
    :data-state="props.active ? 'active' : 'inactive'"
    :class="
      cn(
        'inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-newt-text-muted transition-colors duration-fast ease-newt',
        'hover:text-newt-text-primary data-[state=active]:text-newt-text-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
