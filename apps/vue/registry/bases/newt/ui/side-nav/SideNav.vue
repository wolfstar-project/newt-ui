<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * The vertical list of sections down the side of a settings screen: a named
 * `<nav>` of groups. Pass `aria-label` to say what it navigates.
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <nav :class="cn('flex w-full flex-col', props.class)"><slot /></nav>
</template>
