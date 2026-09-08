<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <section :class="cn('px-4 pb-2 pt-10', props.class)">
    <slot />
  </section>
</template>
