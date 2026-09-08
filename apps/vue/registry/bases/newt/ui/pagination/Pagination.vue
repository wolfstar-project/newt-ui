<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <nav
    role="navigation"
    aria-label="Pagination"
    :class="cn('flex items-center gap-1', props.class)"
  >
    <slot />
  </nav>
</template>
