<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

/*
 * A record of who changed what, newest first, as an ordered list. Pass
 * `aria-label` to name it.
 */
const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <ol :class="cn('m-0 flex w-full list-none flex-col gap-2 p-0', props.class)">
    <slot />
  </ol>
</template>
