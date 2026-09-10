<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { stageBannerDotVariants, type StageBannerDotVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  status?: StageBannerDotVariants["status"]
}>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn(stageBannerDotVariants({ status: props.status }), props.class)"
  />
</template>
