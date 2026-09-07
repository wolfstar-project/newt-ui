<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div data-slot="message-body" :class="cn('min-w-0 flex-1', props.class)">
    <slot />
  </div>
</template>
