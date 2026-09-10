<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn('h-2 w-2 rounded-full bg-current', props.class)"
  />
</template>
