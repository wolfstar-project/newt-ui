<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<{ class?: HTMLAttributes["class"]; active?: boolean }>(),
  { active: false }
)
</script>

<template>
  <!-- Row that previews the command already typed, rendered with `<SlashCommand>`. -->
  <div
    role="option"
    :aria-selected="props.active"
    :data-state="props.active ? 'active' : 'inactive'"
    :class="
      cn(
        'min-h-11 cursor-pointer rounded-md px-3 py-2 hover:bg-newt-bg-hover',
        'data-[state=active]:bg-newt-bg-active',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
