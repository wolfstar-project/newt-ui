<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { serverBannerDotVariants, type ServerBannerDotVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  status?: ServerBannerDotVariants["status"]
}>()
</script>

<template>
  <span :class="cn('flex items-center gap-[5px]', props.class)">
    <span :class="serverBannerDotVariants({ status })" aria-hidden="true" />
    <slot />
  </span>
</template>
