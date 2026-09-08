<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <span aria-hidden="true" :class="cn('shrink-0 opacity-80', props.class)">
    <slot />
  </span>
</template>
