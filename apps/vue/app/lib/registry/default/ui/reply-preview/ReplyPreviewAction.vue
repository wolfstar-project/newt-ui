<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<!-- "used" — the verb between the author and an interaction chip. -->
<template>
  <span :class="cn('shrink-0', props.class)"><slot /></span>
</template>
