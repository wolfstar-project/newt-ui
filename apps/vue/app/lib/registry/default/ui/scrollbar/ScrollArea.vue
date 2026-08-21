<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { scrollbarClassName } from "."

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <div :class="cn('overflow-auto', scrollbarClassName, props.class)">
    <slot />
  </div>
</template>
