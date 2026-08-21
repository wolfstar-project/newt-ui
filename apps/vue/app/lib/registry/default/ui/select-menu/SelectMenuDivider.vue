<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="separator"
    :class="cn('mx-1.5 my-1 h-px bg-newt-border', props.class)"
  />
</template>
