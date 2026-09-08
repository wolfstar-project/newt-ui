<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!-- The row of reactions under a message. -->
<template>
  <div :class="cn('mt-1 flex flex-wrap items-center gap-1', props.class)">
    <slot />
  </div>
</template>
