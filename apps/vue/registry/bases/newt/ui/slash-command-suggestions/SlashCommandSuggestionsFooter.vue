<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <!-- Bar under the rail and the list, for the command being typed. -->
  <div
    :class="
      cn(
        'col-span-full row-start-2 flex min-w-0 items-center gap-2 border-t border-newt-border px-3 py-2 text-[13px] leading-snug text-newt-text-secondary',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
