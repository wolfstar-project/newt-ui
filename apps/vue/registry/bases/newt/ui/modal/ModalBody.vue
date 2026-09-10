<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <div
    :class="cn('p-4 text-sm leading-5 text-newt-text-secondary', props.class)"
  >
    <slot />
  </div>
</template>
