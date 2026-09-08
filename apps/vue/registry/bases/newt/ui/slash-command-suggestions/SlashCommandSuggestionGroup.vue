<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <section role="group" :class="cn('min-w-0', props.class)">
    <slot />
  </section>
</template>
