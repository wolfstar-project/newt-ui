<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

import { codeTokenVariants, type CodeTokenVariants } from "."

const props = defineProps<{
  class?: HTMLAttributes["class"]
  kind?: CodeTokenVariants["kind"]
}>()
</script>

<template>
  <span :class="cn(codeTokenVariants({ kind: props.kind }), props.class)"
    ><slot
  /></span>
</template>
