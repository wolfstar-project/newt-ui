<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{ class?: HTMLAttributes["class"] }>()
</script>

<template>
  <tbody
    :class="
      cn(
        '[&>tr:hover]:bg-newt-bg-hover [&>tr:not(:first-child)>td]:border-t [&>tr:not(:first-child)>td]:border-newt-border',
        props.class
      )
    "
  >
    <slot />
  </tbody>
</template>
