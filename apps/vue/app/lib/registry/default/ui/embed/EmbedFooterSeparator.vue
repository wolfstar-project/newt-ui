<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!-- Middle dot, the way Discord separates footer text from the timestamp. -->
<template>
  <span aria-hidden="true" :class="cn('mx-1', props.class)">
    <slot>&bull;</slot>
  </span>
</template>
