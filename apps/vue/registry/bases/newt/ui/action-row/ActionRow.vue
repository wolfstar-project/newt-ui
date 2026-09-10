<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!--
  The row of interactive components under a message. Discord fits five per
  row, so stack rows when a message needs more than that.
-->
<template>
  <div
    role="group"
    :class="cn('flex flex-wrap items-center gap-2 [&+&]:mt-2', props.class)"
  >
    <slot />
  </div>
</template>
