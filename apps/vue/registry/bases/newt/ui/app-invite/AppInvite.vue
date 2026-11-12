<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <article
    :class="
      cn(
        'flex max-w-[432px] flex-col overflow-hidden rounded-lg bg-newt-bg-surface text-newt-text-primary',
        props.class
      )
    "
  >
    <slot />
  </article>
</template>
