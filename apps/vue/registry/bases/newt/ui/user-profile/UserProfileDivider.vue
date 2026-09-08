<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    role="separator"
    :class="cn('my-[10px] h-px bg-newt-border', props.class)"
  >
    <slot />
  </div>
</template>
