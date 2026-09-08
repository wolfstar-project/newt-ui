<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  src: string
  alt?: string
}>()
</script>

<template>
  <img
    :src="props.src"
    :alt="props.alt ?? ''"
    :class="cn('h-full w-full object-cover', props.class)"
  />
</template>
