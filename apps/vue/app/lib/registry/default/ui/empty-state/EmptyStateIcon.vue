<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div
    aria-hidden="true"
    :class="cn('mb-1 text-[40px] leading-none opacity-60', props.class)"
  >
    <slot />
  </div>
</template>
