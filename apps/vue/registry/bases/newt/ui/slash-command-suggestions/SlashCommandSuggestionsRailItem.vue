<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes["class"]; active?: boolean }>(),
  { active: false }
)
</script>

<template>
  <button
    type="button"
    :aria-pressed="props.active"
    :data-state="props.active ? 'active' : 'inactive'"
    :class="
      cn(
        'inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-newt-text-muted transition-colors duration-fast ease-newt',
        'hover:bg-newt-bg-hover hover:text-newt-text-primary',
        'data-[state=active]:bg-newt-bg-active data-[state=active]:text-newt-text-primary',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-newt-text-link',
        props.class
      )
    "
  >
    <slot />
  </button>
</template>
