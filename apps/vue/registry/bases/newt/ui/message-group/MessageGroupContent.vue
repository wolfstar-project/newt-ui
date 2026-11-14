<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!-- No colour of its own: the content takes the colour of the row. -->
<template>
  <div :class="cn('text-[15px] leading-[1.5]', props.class)">
    <slot />
  </div>
</template>
